import path from 'path'
import core from '@actions/core'
import matter from 'gray-matter'
import glob from 'glob'
import Joi from 'joi'

//  front matter variable names must be snake_case
export const frontMatterSchema = Joi.object().pattern(
  /^[a-zA-Z_]\w*$/,
  Joi.any()
)

// we export the `run` function for testing.
// Call `run()` directly if this file is the entry point
if (import.meta.url.endsWith(process.argv[1])) {
  run(process.env, core, matter)
}

/**
 * @param {NodeJS.ProcessEnv} env
 * @param {core} core
 * @param {matter} matter
 */
export async function run(env, core, matter) {
  let hasFailed = false
  const mdFiles = glob.sync('docs/**/*.md')

  mdFiles.forEach(file => {
    try {
      const {data} = matter.read(path.join(process.cwd(), file))

      const {error} = frontMatterSchema.validate(data, {
        abortEarly: false
      })

      if (error) {
        core.error(error.message, {
          file,
          title: 'Front matter variables must be snake_case'
        })
        hasFailed = true
      }
    } catch (e) {
      core.error(e.message, {
        file,
        startLine: e.mark?.line ? e.mark.line + 1 : 0
      })
      hasFailed = true
    }
  })

  if (hasFailed) core.setFailed('Front matter fails validation')
}
