//import fs from 'fs/promises'
import path from 'path'
//import fs from 'fs'
//import fs from 'fs';
//import path from 'path';
import matter from 'gray-matter'

import {EOL} from 'os'
import {visit} from 'unist-util-visit'
import stripIndent from 'strip-indent'
import type {Root, Code, Parent} from 'mdast'
import type {VFile} from 'vfile'

interface CodeImportOptions {
  async?: boolean
  preserveTrailingNewline?: boolean
  removeRedundantIndentations?: boolean
  rootDir?: string
  allowImportingFromOutside?: boolean
  filePath: string
  fsHandle?: any
}

function extractLines(
  content: string,
  fromLine: number | undefined,
  hasDash: boolean,
  toLine: number | undefined,
  preserveTrailingNewline: boolean = false
) {
  const lines = content.split(EOL)
  const start = fromLine || 1
  let end
  if (!hasDash) {
    end = start
  } else if (toLine) {
    end = toLine
  } else if (lines[lines.length - 1] === '' && !preserveTrailingNewline) {
    end = lines.length - 1
  } else {
    end = lines.length
  }
  return lines.slice(start - 1, end).join('\n')
}

function codeImport(options: CodeImportOptions) {
  const rootDir = options.rootDir || process.cwd()
  const sourceFilePath = path.resolve(rootDir, options.filePath)
  const dirName = path.dirname(sourceFilePath)

  const fsHandle = options.fsHandle

  if (!path.isAbsolute(rootDir)) {
    throw new Error(`"rootDir" has to be an absolute path`)
  }

  return function transformer(tree: Root, file: VFile) {
    const codes: [Code, number | null, Parent][] = []
    const promises: Promise<void>[] = []

    visit(tree, 'code', (node, index, parent) => {
      codes.push([node as Code, index, parent as Parent])
    })

    for (const [node] of codes) {
      const fileMeta = (node.meta || '')
        // Allow escaping spaces
        .split(/(?<!\\) /g)
        .find(meta => meta.startsWith('file='))

      if (!fileMeta) {
        continue
      }

      const res =
        /^file=(?<path>.+?)(?:(?:#(?:L(?<from>\d+)(?<dash>-)?)?)(?:L(?<to>\d+))?)?$/.exec(
          fileMeta
        )
      if (!res || !res.groups || !res.groups.path) {
        throw new Error(`Unable to parse file path ${fileMeta}`)
      }
      const filePath = res.groups.path
      const fromLine = res.groups.from
        ? parseInt(res.groups.from, 10)
        : undefined
      const hasDash = !!res.groups.dash || fromLine === undefined
      const toLine = res.groups.to ? parseInt(res.groups.to, 10) : undefined
      const normalizedFilePath = filePath
        .replace(/^<rootDir>/, rootDir)
        .replace(/\\ /g, ' ')

      // normalizedFilePath might be relative or absolute prior to
      // this step
      const fileAbsPath = path.resolve(dirName, normalizedFilePath)

      if (!options.allowImportingFromOutside) {
        const relativePathFromRootDir = path.relative(rootDir, fileAbsPath)
        if (
          !rootDir ||
          relativePathFromRootDir.startsWith(`..${path.sep}`) ||
          path.isAbsolute(relativePathFromRootDir)
        ) {
          throw new Error(
            `Attempted to import code from "${fileAbsPath}", which is outside from the rootDir "${rootDir}"`
          )
        }
      }

      const fs = fsHandle

      const source = fs.readFileSync(fileAbsPath)
      let {content: fileContent, data} = matter(source)

      node.value = extractLines(
        fileContent,
        fromLine,
        hasDash,
        toLine,
        options.preserveTrailingNewline
      )

      if (options.removeRedundantIndentations) {
        node.value = stripIndent(node.value)
      }
    }

    if (promises.length) {
      return Promise.all(promises)
    }
  }
}

export {codeImport}
