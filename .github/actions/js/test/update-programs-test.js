import {readFile} from 'node:fs/promises'
import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'
import {equal, deepEqual} from 'node:assert/strict'

const pathToCurrentDirectory = dirname(fileURLToPath(import.meta.url))

import {suite} from 'uvu'
import MockDate from 'mockdate'

import {run} from '../update-programs.js'

const programUpdateEventTest = suite('program_update event')
programUpdateEventTest(
  'update *.mdx file for initiative (no open PR)',
  async () => {
    // load fixtures
    const {programUpdate} = await import(
      './fixtures/happy-path/program-update.js'
    )
    const contentBefore = await readFile(
      join(
        pathToCurrentDirectory,
        'fixtures',
        'happy-path',
        'codespaces-before.mdx'
      ),
      'utf8'
    )
    const contentAfter = await readFile(
      join(
        pathToCurrentDirectory,
        'fixtures',
        'happy-path',
        'codespaces-after.mdx'
      ),
      'utf8'
    )

    // mock octokit
    const mockOctokit = {
      async request(route, parameters) {
        if (route === 'GET /repos/{owner}/{repo}/contents/{path}') {
          return {
            data: contentBefore
          }
        }

        if (route === 'GET /repos/{owner}/{repo}/pulls') {
          return {data: []}
        }

        if (route === 'DELETE /repos/{owner}/{repo}/git/refs/{ref}') {
          const error = new Error('Not Found Error Mock')
          error.status = 422
          throw error
        }

        throw new Error(`No mock implemente for "${route}"`)
      },

      async createPullRequest(parameters) {
        const {changes, ...rest} = parameters

        deepEqual(rest, {
          owner: 'github-test',
          repo: 'technical-program-management-artifacts',
          title: '🤖📯 Codespaces program status update',
          body:
            'Dear Humans,\n' +
            '\n' +
            'This is an automated updated initiated by the Codespaces program update posted at <comment url>\n' +
            '\n' +
            'If you have any questions, please ping @gr2m or @aleah from the TPM team',
          head: 'program/codespaces/update/123'
        })

        equal(changes.length, 1, 'PR should have a single commit')
        deepEqual(
          Object.keys(changes[0].files),
          ['path/to/initiative.mdx'],
          'Commit should have a single file change'
        )
        equal(
          changes[0].commit,
          'Codespaces program updated via <comment url>',
          'commit message'
        )

        const newContent = changes[0].files['path/to/initiative.mdx']({
          encoding: 'base64',
          content: Buffer.from(contentBefore, 'utf-8').toString('base64')
        })
        equal(newContent, contentAfter)

        return {data: {html_url: '<pull request url>'}}
      }
    }

    // mock @actions/core
    const logs = []
    const toolkitMock = {
      info: message => logs.push(message.trim()),
      warning: message => {
        throw new Error(message)
      },
      setFailed: message => {
        throw new Error(message)
      }
    }

    // mock envrionment variables
    const env = {
      PROGRAM_13: 'path/to/initiative.mdx',
      GITHUB_TOKEN: 'secret',
      GITHUB_REPOSITORY: 'github-test/technical-program-management-artifacts'
    }

    // run the action
    await run(env, 'program_report', programUpdate, toolkitMock, mockOctokit)

    // assertions
    deepEqual(logs, [
      'Handling update for path/to/initiative.mdx',
      'Program report is for the latest program report (https://github.com/github/technical-program-management/issues/34#issuecomment-123) referenced in the program initiative page at path/to/initiative.mdx',
      'Pull request created at <pull request url>'
    ])
  }
)

programUpdateEventTest(
  'update *.mdx file for initiative (has open PR)',
  async () => {
    // load fixtures
    const {programUpdate} = await import(
      './fixtures/happy-path/program-update.js'
    )
    const contentBefore = await readFile(
      join(
        pathToCurrentDirectory,
        'fixtures',
        'happy-path',
        'codespaces-before.mdx'
      ),
      'utf8'
    )
    const contentAfter = await readFile(
      join(
        pathToCurrentDirectory,
        'fixtures',
        'happy-path',
        'codespaces-after.mdx'
      ),
      'utf8'
    )

    // mock octokit
    const mockOctokit = {
      async request(route, parameters) {
        if (route === 'GET /repos/{owner}/{repo}/contents/{path}') {
          return {
            data: contentBefore
          }
        }

        if (route === 'GET /repos/{owner}/{repo}/pulls') {
          return {
            data: [
              {
                html_url: '<pull request url>'
              }
            ]
          }
        }

        if (route === 'DELETE /repos/{owner}/{repo}/git/refs/{ref}') {
          const error = new Error('Not Found Error Mock')
          error.status = 404
          throw error
        }

        throw new Error(`No mock implemente for "${route}"`)
      },

      async createOrUpdateTextFile(parameters) {
        const {content, ...rest} = parameters

        deepEqual(rest, {
          owner: 'github-test',
          repo: 'technical-program-management-artifacts',
          path: 'path/to/initiative.mdx',
          branch: 'program/codespaces/update/123',
          message: 'Codespaces program updated via <comment url>'
        })

        const newContent = await content({content: contentBefore})
        equal(newContent, contentAfter)

        return
      }
    }

    // mock @actions/core
    const logs = []
    const toolkitMock = {
      info: message => logs.push(message.trim()),
      warning: message => {
        throw new Error(message)
      },
      setFailed: message => {
        throw new Error(message)
      }
    }

    // mock envrionment variables
    const env = {
      PROGRAM_13: 'path/to/initiative.mdx',
      GITHUB_TOKEN: 'secret',
      GITHUB_REPOSITORY: 'github-test/technical-program-management-artifacts'
    }

    // run the action
    await run(env, 'program_report', programUpdate, toolkitMock, mockOctokit)

    // assertions
    deepEqual(logs, [
      'Handling update for path/to/initiative.mdx',
      'Program report is for the latest program report (https://github.com/github/technical-program-management/issues/34#issuecomment-123) referenced in the program initiative page at path/to/initiative.mdx',
      'Pull request updated at <pull request url>'
    ])
  }
)

programUpdateEventTest(
  'update *.mdx file for initiative (no review)',
  async () => {
    // load fixtures
    const {programUpdate} = await import(
      './fixtures/no-review/program-update.js'
    )
    const contentBefore = await readFile(
      join(
        pathToCurrentDirectory,
        'fixtures',
        'no-review',
        'codespaces-before.mdx'
      ),
      'utf8'
    )
    const contentAfter = await readFile(
      join(
        pathToCurrentDirectory,
        'fixtures',
        'no-review',
        'codespaces-after.mdx'
      ),
      'utf8'
    )

    // mock octokit
    const mockOctokit = {
      async request(route, parameters) {
        if (route === 'GET /repos/{owner}/{repo}/contents/{path}') {
          return {
            data: contentBefore
          }
        }

        if (route === 'GET /repos/{owner}/{repo}/pulls') {
          return {
            data: [
              {
                html_url: '<pull request url>'
              }
            ]
          }
        }

        if (route === 'DELETE /repos/{owner}/{repo}/git/refs/{ref}') {
          const error = new Error('Not Found Error Mock')
          error.status = 404
          throw error
        }

        throw new Error(`No mock implemente for "${route}"`)
      },

      async createOrUpdateTextFile(parameters) {
        const {content, ...rest} = parameters

        deepEqual(rest, {
          owner: 'github-test',
          repo: 'technical-program-management-artifacts',
          path: 'path/to/initiative.mdx',
          branch: 'program/codespaces/update/123',
          message: 'Codespaces program updated via <comment url>'
        })

        const newContent = await content({content: contentBefore})
        equal(newContent, contentAfter)

        return
      }
    }

    // mock @actions/core
    const logs = []
    const toolkitMock = {
      info: message => logs.push(message.trim()),
      warning: message => {
        throw new Error(message)
      },
      setFailed: message => {
        throw new Error(message)
      }
    }

    // mock envrionment variables
    const env = {
      PROGRAM_13: 'path/to/initiative.mdx',
      GITHUB_TOKEN: 'secret',
      GITHUB_REPOSITORY: 'github-test/technical-program-management-artifacts'
    }

    // run the action
    await run(env, 'program_report', programUpdate, toolkitMock, mockOctokit)

    // assertions
    deepEqual(logs, [
      'Handling update for path/to/initiative.mdx',
      'Program report is for the latest program report (https://github.com/github/technical-program-management/issues/13#issuecomment-123) referenced in the program initiative page at path/to/initiative.mdx',
      'Pull request updated at <pull request url>'
    ])
  }
)

programUpdateEventTest('Program not supported', async () => {
  // load fixtures
  const {programUpdate} = await import('./fixtures/no-review/program-update.js')

  // mock octokit
  const mockOctokit = {}

  // mock @actions/core
  const logs = []
  const toolkitMock = {
    info: message => logs.push(message.trim()),
    warning: message => {
      throw new Error(message)
    },
    setFailed: message => {
      throw new Error(message)
    }
  }

  // mock envrionment variables
  const env = {
    GITHUB_REPOSITORY: 'github-test/technical-program-management-artifacts'
    // `PROGRAM_13` is not set
    // PROGRAM_13: "path/to/initiative.mdx"
  }

  // run the action
  await run(env, 'program_report', programUpdate, toolkitMock, mockOctokit)

  // assertions
  deepEqual(logs, [
    'Program "Codespaces" (#13) is not setup for automated updates of a looking forward page. Add a "PROGRAM_13" env variable to the workflow to enable updates for it'
  ])
})

programUpdateEventTest('File does not exist', async () => {
  // load fixtures
  const {programUpdate} = await import('./fixtures/no-review/program-update.js')

  // mock octokit
  const mockOctokit = {
    async request(route, parameters) {
      if (route === 'GET /repos/{owner}/{repo}/contents/{path}') {
        const error = new Error('404')
        error.status = 404
        throw error
      }

      throw new Error(`No mock implemente for "${route}"`)
    }
  }

  // mock @actions/core
  const logs = []
  const toolkitMock = {
    info: message => logs.push(message.trim()),
    warning: message => {
      throw new Error(message)
    },
    setFailed: message => {
      throw new Error(message)
    }
  }

  // mock envrionment variables
  const env = {
    PROGRAM_13: 'path/does/not/exist.mdx',
    GITHUB_REPOSITORY: 'github-test/technical-program-management-artifacts'
  }

  // run the action
  try {
    await run(env, 'program_report', programUpdate, toolkitMock, mockOctokit)
    throw new Error('Should have thrown an error')
  } catch (error) {
    equal(
      error.message,
      'Program updates from Codespaces (#13) are configured to update path/does/not/exist.mdx, but no such file exists'
    )
  }

  // assertions
  deepEqual(logs, ['Handling update for path/does/not/exist.mdx'])
})

programUpdateEventTest(
  'initiative.program_report_url is not defined in front-matter',
  async () => {
    // load fixtures
    const {programUpdate} = await import(
      './fixtures/no-review/program-update.js'
    )

    // mock octokit
    const mockOctokit = {
      async request(route, parameters) {
        if (route === 'GET /repos/{owner}/{repo}/contents/{path}') {
          return {
            data: 'nope'
          }
        }

        throw new Error(`No mock implemente for "${route}"`)
      }
    }

    // mock @actions/core
    const logs = []
    const toolkitMock = {
      info: message => logs.push(message.trim()),
      warning: message => {
        throw new Error(message)
      },
      setFailed: message => {
        throw new Error(message)
      }
    }

    // mock envrionment variables
    const env = {
      PROGRAM_13: 'path/does/not/exist.mdx',
      GITHUB_REPOSITORY: 'github-test/technical-program-management-artifacts'
    }

    // run the action
    try {
      await run(env, 'program_report', programUpdate, toolkitMock, mockOctokit)
      throw new Error('Should have thrown an error')
    } catch (error) {
      equal(
        error.message,
        'initiative.program_report_url not set in front-matter of path/does/not/exist.mdx'
      )
    }

    // assertions
    deepEqual(logs, ['Handling update for path/does/not/exist.mdx'])
  }
)

programUpdateEventTest(
  'initiative.program_report_url is not the same as the one from the program_report dispatch event',
  async () => {
    // load fixtures
    const {programUpdate} = await import(
      './fixtures/no-review/program-update.js'
    )
    const programUpdateWithCustomReportId = {
      ...programUpdate,
      report: {
        ...programUpdate.report,
        id: 1234
      }
    }

    const contentBefore = await readFile(
      join(
        pathToCurrentDirectory,
        'fixtures',
        'happy-path',
        'codespaces-before.mdx'
      ),
      'utf8'
    )

    // mock octokit
    const mockOctokit = {
      async request(route, parameters) {
        if (route === 'GET /repos/{owner}/{repo}/contents/{path}') {
          return {
            data: contentBefore
          }
        }

        throw new Error(`No mock implemente for "${route}"`)
      }
    }

    // mock @actions/core
    const logs = []
    const toolkitMock = {
      info: message => logs.push(message.trim()),
      warning: message => {
        throw new Error(message)
      },
      setFailed: message => {
        throw new Error(message)
      }
    }

    // mock envrionment variables
    const env = {
      PROGRAM_13: 'path/does/not/exist.mdx',
      GITHUB_REPOSITORY: 'github-test/technical-program-management-artifacts'
    }

    // run the action
    await run(
      env,
      'program_report',
      programUpdateWithCustomReportId,
      toolkitMock,
      mockOctokit
    )

    // assertions
    deepEqual(logs, [
      'Handling update for path/does/not/exist.mdx',
      'Program report (https://github.com/github/technical-program-management/issues/34#issuecomment-1234) is not for the latest program report (https://github.com/github/technical-program-management/issues/34#issuecomment-123) referenced in the program initiative page at path/does/not/exist.mdx'
    ])
  }
)

programUpdateEventTest.run()

const programsDashboardReportEventTest = suite(
  'programs_dashboard_report event'
)

programsDashboardReportEventTest('creates pull request', async () => {
  MockDate.set('2022-02-02')

  // load fixtures
  const {programUpdate} = await import(
    './fixtures/dashboard-report/programs-dashboard-report.js'
  )
  const contentBefore = await readFile(
    join(
      pathToCurrentDirectory,
      'fixtures',
      'dashboard-report',
      'codespaces-before.mdx'
    ),
    'utf8'
  )
  const contentAfter = await readFile(
    join(
      pathToCurrentDirectory,
      'fixtures',
      'dashboard-report',
      'codespaces-after.mdx'
    ),
    'utf8'
  )

  // mock octokit
  const mockOctokit = {
    async request(route, parameters) {
      if (route === 'GET /repos/{owner}/{repo}/contents/{path}') {
        return {
          data: contentBefore
        }
      }

      throw new Error(`No mock implemente for "${route}"`)
    },

    async createPullRequest(parameters) {
      const {changes, ...rest} = parameters

      deepEqual(rest, {
        owner: 'github-test',
        repo: 'technical-program-management-artifacts',
        title: '🤖📯 Initiatives updates',
        body:
          'Dear Humans,\n' +
          '\n' +
          "This is an automated updated initiated by the `github/programs' dashboard report at <dashboard report url>\n" +
          '\n' +
          'If you have any questions, please ping @gr2m or @aleah from the TPM team',
        head: 'programs/dashboard-report-2022-02-02'
      })

      equal(changes.length, 1, 'PR should have a single commit')
      deepEqual(
        Object.keys(changes[0].files),
        ['path/to/initiative.mdx'],
        'Commit should have a single file change'
      )
      equal(
        changes[0].commit,
        'Initiatives updated via <dashboard report url>',
        'commit message'
      )

      const newContent = changes[0].files['path/to/initiative.mdx']({
        encoding: 'base64',
        content: Buffer.from(contentBefore, 'utf-8').toString('base64')
      })
      equal(newContent, contentAfter)

      return {data: {html_url: '<pull request url>'}}
    }
  }

  // mock @actions/core
  const logs = []
  const toolkitMock = {
    info: message => logs.push(message.trim()),
    warning: message => {
      throw new Error(message)
    },
    setFailed: message => {
      throw new Error(message)
    }
  }

  // mock envrionment variables
  const env = {
    PROGRAM_13: 'path/to/initiative.mdx',
    GITHUB_TOKEN: 'secret',
    GITHUB_REPOSITORY: 'github-test/technical-program-management-artifacts'
  }

  // run the action
  await run(
    env,
    'programs_dashboard_report',
    programUpdate,
    toolkitMock,
    mockOctokit
  )

  // assertions
  deepEqual(logs, ['Pull request created at <pull request url>'])
})

programsDashboardReportEventTest.run()
