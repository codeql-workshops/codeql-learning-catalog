// @ts-check

import {readFile} from 'fs/promises'
import {inspect} from 'util'

import core from '@actions/core'
import {Octokit} from 'octokit'
import {createOrUpdateTextFile} from '@octokit/plugin-create-or-update-text-file'
import {createPullRequest} from 'octokit-plugin-create-pull-request'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import matter from '@gr2m/gray-matter'

dayjs.extend(utc)
const MyOctokit = Octokit.plugin(createPullRequest, createOrUpdateTextFile)

// we export the `run` function for testing.
// Call `run()` directly if this file is the entry point
// @ts-expect-error - import.meta is not typed
if (import.meta.url.endsWith(process.argv[1])) {
  readFile(process.env.GITHUB_EVENT_PATH, 'utf8').then(content => {
    const {action, client_payload} = JSON.parse(content)
    const octokit = new MyOctokit({
      auth: process.env.GITHUB_TOKEN
    })
    run(process.env, action, client_payload, core, octokit)
  })
}

/**
 * @param {NodeJS.ProcessEnv} env
 * @param {"program_report" | "programs_dashboard_report"} action
 * @param {import("./types").ProgramReportEvent | import("./types").ProgramsDashboardEvent} clientPayload
 * @param {core} core
 * @param {InstanceType<typeof MyOctokit>} octokit
 */
export async function run(env, action, clientPayload, core, octokit) {
  const [owner, repo] = env.GITHUB_REPOSITORY.split('/')
  const supportedPrograms = Object.fromEntries(
    Object.keys(env)
      .filter(key => /^PROGRAM_\d+$/.test(key))
      .map(key => [parseInt(key.replace(/^PROGRAM_/, ''), 10)])
      .map(id => [id, env[`PROGRAM_${id}`]])
  )

  if (action === 'program_report') {
    return handleProgramReport(
      owner,
      repo,
      supportedPrograms,
      // @ts-expect-error - clientPayload is still typed as a union, but we know it's a ProgramReportEvent
      clientPayload,
      core,
      octokit
    )
  }

  if (action === 'programs_dashboard_report') {
    return handleProgramsDashboardEvent(
      owner,
      repo,
      supportedPrograms,
      // @ts-expect-error - clientPayload is still typed as a union, but we know it's a ProgramsDashboardEvent
      clientPayload,
      core,
      octokit
    )
  }

  core.setFailed(`Unknown repository dispatch action: '${action}'`)
}

/**
 * @param {string} owner
 * @param {string} repo
 * @param {Record<number, string>} supportedPrograms
 * @param {import("./types").ProgramReportEvent} programReportEvent
 * @param {core} core
 * @param {InstanceType<typeof MyOctokit>} octokit
 */
export async function handleProgramReport(
  owner,
  repo,
  supportedPrograms,
  programReportEvent,
  core,
  octokit
) {
  const programId = programReportEvent.program.id

  if (!supportedPrograms[programId]) {
    core.info(
      `Program "${programReportEvent.program.name}" (#${programId}) is not setup for automated updates of a looking forward page. Add a "PROGRAM_${programId}" env variable to the workflow to enable updates for it`
    )
    return
  }

  const path = supportedPrograms[programId]
  core.info(`Handling update for ${path}`)

  // confirm that the file actually exists
  //
  const currentContent = await octokit
    .request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner,
      repo,
      path,
      mediaType: {
        format: 'raw'
      }
    })
    .then(
      response => response.data,
      error => {
        if (error.status !== 404) {
          core.info(inspect(error))
        }

        return ''
      }
    )

  if (!currentContent) {
    core.setFailed(
      `Program updates from ${programReportEvent.program.name} (#${programId}) are configured to update ${path}, but no such file exists`
    )
    process.exit()
  }

  // get current data
  const {data} = matter(String(currentContent))

  if (!data.initiative?.program_report_url) {
    core.setFailed(
      `initiative.program_report_url not set in front-matter of ${path}`
    )
    return
  }

  const currentProgramReportUrl = data.initiative.program_report_url.replace(
    /#issuecomment-\d+$/,
    `#issuecomment-${programReportEvent.report.id}`
  )

  if (data.initiative.program_report_url !== currentProgramReportUrl) {
    core.info(
      `Program report (${currentProgramReportUrl}) is not for the latest program report (${data.initiative.program_report_url}) referenced in the program initiative page at ${path}`
    )
    return
  }

  core.info(
    `Program report is for the latest program report (${data.initiative.program_report_url}) referenced in the program initiative page at ${path}`
  )

  const lastUpdateUrl = programReportEvent.report.url
  const branch = `program/${programReportEvent.program.name
    .toLowerCase()
    .replace(/\W+/g, '-')}/update/${programReportEvent.report.id}`

  // find out if we already have a pull request open
  // https://docs.github.com/en/rest/reference/pulls#list-pull-requests
  const {
    data: [pr]
  } = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
    owner,
    repo,
    head: `${owner}:${branch}`,
    per_page: 1
  })

  if (pr) {
    await octokit.createOrUpdateTextFile({
      owner,
      repo,
      path,
      branch,
      content({content}) {
        return updateFrontMatter(content, programReportEvent)
      },
      message: `${programReportEvent.program.name} program updated via ${lastUpdateUrl}`
    })

    core.info(`Pull request updated at ${pr.html_url}`)
    return
  }

  // it's possible that the branch still exists from a previous pull request
  // https://docs.github.com/en/rest/reference/git#delete-a-reference
  await octokit
    .request('DELETE /repos/{owner}/{repo}/git/refs/{ref}', {
      owner,
      repo,
      ref: `heads/${branch}`
    })
    .catch(error => {
      if (error.status === 422) {
        // branch does not exist, all good
        return
      }

      core.setFailed(inspect(error, {depth: Infinity}))
      process.exit()
    })

  // https://github.com/gr2m/octokit-plugin-create-pull-request#usage
  const {data: newPr} = await octokit.createPullRequest({
    owner,
    repo,
    title: `🤖📯 ${programReportEvent.program.name} program status update`,
    body: `Dear Humans,

This is an automated updated initiated by the ${programReportEvent.program.name} program update posted at ${lastUpdateUrl}

If you have any questions, please ping @gr2m or @aleah from the TPM team`,
    head: branch,
    changes: [
      {
        files: {
          [path]: ({encoding, content}) => {
            return updateFrontMatter(
              Buffer.from(content, encoding).toString('utf-8'),
              programReportEvent
            )
          }
        },
        commit: `${programReportEvent.program.name} program updated via ${lastUpdateUrl}`
      }
    ]
  })

  core.info(`Pull request created at ${newPr.html_url}`)
}

/**
 * @param {string} owner
 * @param {string} repo
 * @param {Record<number, string>} supportedPrograms
 * @param {import("./types").ProgramsDashboardEvent} programsDashboardEvent
 * @param {core} core
 * @param {InstanceType<typeof MyOctokit>} octokit
 */
export async function handleProgramsDashboardEvent(
  owner,
  repo,
  supportedPrograms,
  programsDashboardEvent,
  core,
  octokit
) {
  const files = Object.fromEntries(
    programsDashboardEvent.programsWithReport
      .filter(
        programWithReport => supportedPrograms[programWithReport.program.id]
      )
      .map(programWithReport => [
        supportedPrograms[programWithReport.program.id],
        ({encoding, content}) => {
          if (!content) {
            core.warning(
              `No initiative page found at ${
                supportedPrograms[programWithReport.program.id]
              }, but it is configured in .github/workflows/programs.yml`
            )
            return null
          }
          return updateFrontMatter(
            Buffer.from(content, encoding).toString('utf-8'),
            programWithReport
          )
        }
      ])
  )

  const branch = `programs/dashboard-report-${dayjs
    .utc(programsDashboardEvent.createdAt)
    .format('YYYY-MM-DD')}`

  // https://github.com/gr2m/octokit-plugin-create-pull-request#usage
  const {data: newPr} = await octokit.createPullRequest({
    owner,
    repo,
    title: `🤖📯 Initiatives updates`,
    body: `Dear Humans,

This is an automated updated initiated by the \`github/programs\' dashboard report at ${programsDashboardEvent.url}

If you have any questions, please ping @gr2m or @aleah from the TPM team`,
    head: branch,
    changes: [
      {
        files,
        commit: `Initiatives updated via ${programsDashboardEvent.url}`
      }
    ]
  })

  core.info(`Pull request created at ${newPr.html_url}`)
}

/**
 * Ideally we would use an established library to update front-matter
 * in the markdown file. However no such library exists yet. So we
 * fallback to using regexes. The disadvantage is that the updates
 * will not work if the expected properties don't exist yet.
 *
 * @param {string} currentContent
 * @param {import("./types").ProgramReportEvent | import("./types").ProgramsDashboardEvent["programsWithReport"][number] } programReportEvent
 */
function updateFrontMatter(currentContent, programReportEvent) {
  // get updated data
  const status = normalizeStatus(programReportEvent.report.status)
  const color =
    {
      green: 'brightgreen',
      on_hold: 'white'
    }[status] || status
  const statusBadgeUrl = `https://img.shields.io/badge/status-${status}-${color}.svg`

  const summaryOverall = `**Overall Program Status:** ${programReportEvent.report.summary_overall}`
  const summaryLookingBack = `**Looking Back:** ${programReportEvent.report.summary_looking_back}`
  const summaryLookingForward = `**Looking Forward:** ${programReportEvent.report.summary_looking_forward}`
  const summaryImmediateProgramNeeds = programReportEvent.report.summary_needs
    ? `**Immediate Program Needs:** ${programReportEvent.report.summary_needs}`
    : ''
  const summary = [
    summaryOverall,
    summaryLookingBack,
    summaryLookingForward,
    summaryImmediateProgramNeeds
  ]
    .filter(Boolean)
    .join('\n\n')

  // parse curernt markdown file into text content and frontMatter data
  // https://github.com/jonschlinkert/gray-matter#matter
  const {content, data} = matter(currentContent)

  const {nextMilestone} = programReportEvent.program
  const up_next = nextMilestone
    ? `${nextMilestone.label} - ${nextMilestone.date}`
    : ''

  return matter.stringify(content, {
    ...data,
    initiative: {
      ...data.initiative,
      up_next,
      status: statusBadgeUrl,
      program_report_url: programReportEvent.report.url,
      program_report_customer_date_changed:
        programReportEvent.report.customer_date_changed,
      program_report_date: programReportEvent.report.created_at.substr(0, 10),
      program_report_summary: summary
    }
  })
}

function normalizeStatus(statusString) {
  if (/(green)/.test(statusString)) return 'green'
  if (/(yellow)/.test(statusString)) return 'yellow'
  if (/(red)/.test(statusString)) return 'red'
  if (/(on hold)/.test(statusString)) return 'on_hold'
}
