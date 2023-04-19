import {FC} from 'react'
import {useRouter} from 'next/router'
import {
  PencilIcon,
  IssueOpenedIcon,
  EyeIcon,
  TerminalIcon
} from '@primer/octicons-react'
import Breadcrumbs from './Breadcrumbs'
import {repo, siteUrl} from '../codeql-learning-catalog.config.js'

export interface Props {
  filePath: string
  frontMatter?: {
    owner_team?: string
    owner_slack?: string
    owner_repo?: string
    owner_not_needed?: boolean
    layout: string
  }
}

const ActionBar: FC<Props> = ({filePath, frontMatter}) => {
  const router = useRouter()

  const issueTemplate = `
| Owner | Edit file | Live link |
|-|-|-|
| ${
    frontMatter?.owner_team ? `@github/${frontMatter.owner_team}` : ''
  } | [Edit](${repo.url}/edit/${repo.branch}/${filePath}) | [Link](${siteUrl}${
    router.asPath
  }) |

# Context

<!-- Add a description of the issue here -->

# Fix

<!-- Propose your fix here -->

---

${
  frontMatter?.owner_team
    ? `cc @github/${frontMatter.owner_team}`
    : 'cc @github/ps-codeql'
}
`

  return (
    <div className="d-md-flex flex-items-center flex-justify-between pb-4 mb-4 border-bottom">
      <Breadcrumbs />

      {/* TODO: Add "Edit data" button for pages that have data */}
      <div className="BtnGroup mt-3 mt-sm-0">
        <a
          title="Open in codespaces"
          href="https://github.com/codespaces/new?hide_repo_select=true&ref=master&repo=556902411"
          role="button"
          className="BtnGroup-item btn"
          target="_blank"
          rel="noopener"
        >
          <TerminalIcon />
          <span>Open in Codespaces</span>
        </a>
        <a
          href={`${
            repo.url
          }/issues/new?labels=v2,bug&title=Issue%20with%20${encodeURIComponent(
            filePath
          )}&body=${encodeURIComponent(issueTemplate)}`}
          role="button"
          className="BtnGroup-item btn"
          target="_blank"
          rel="noopener"
        >
          <IssueOpenedIcon />
          <span>File an issue</span>
        </a>
      </div>
    </div>
  )
}

export default ActionBar
