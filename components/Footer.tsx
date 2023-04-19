import {FC} from 'react'
import {LockIcon, MegaphoneIcon} from '@primer/octicons-react'
import FooterBox, {Heading, Body} from './FooterBox'

export interface Props {
  frontMatter: {
    owner_team?: string
    owner_slack?: string
    owner_repo?: string
    owner_not_needed?: boolean
    layout: string
  }
}

const Footer: FC<Props> = ({frontMatter, ...props}) => (
  <div className="border-top mt-6 mb-8 pt-2" {...props}>
    {frontMatter.owner_team ||
    frontMatter.owner_slack ||
    frontMatter.owner_repo ? (
      <FooterBox>
        <Heading>Maintainership</Heading>

        <dl className="my-0">
          {frontMatter.owner_team && (
            <>
              <dt>Team</dt>
              <dd>
                <a
                  href={`https://github.com/orgs/github/teams/${frontMatter.owner_team}`}
                >
                  @github/{frontMatter.owner_team}
                </a>
              </dd>
            </>
          )}

          {frontMatter.owner_slack && (
            <>
              <dt>Slack</dt>
              <dd>
                <a
                  href={`https://github.slack.com/channels/${frontMatter.owner_slack}`}
                >
                  #{frontMatter.owner_slack}
                </a>
              </dd>
            </>
          )}

          {frontMatter.owner_repo && (
            <>
              <dt>Repo</dt>
              <dd>
                <a href={`https://github.com/github/${frontMatter.owner_repo}`}>
                  github/{frontMatter.owner_repo}
                </a>
              </dd>
            </>
          )}
        </dl>
      </FooterBox>
    ) : (
      <>
        {!(frontMatter.owner_not_needed || frontMatter.layout === 'news') && (
          <FooterBox icon={MegaphoneIcon}>
            <Heading>Maintainership</Heading>
            <Body>
              This page is currently maintained by{' '}
              <a href="https://github.com/orgs/codeql-workshops/teams/ps-codeql-workshops">
                @codeql-workshops/ps-codeql-workshops
              </a>{' '}
              Please reach out to us on{' '}
              <a href="https://github.com/codeql-workshops/codeql-learning-catalog">
                our issue tracker
              </a>{' '}
              if you have any questions or comments about the content on this
              page.
            </Body>
          </FooterBox>
        )}
      </>
    )}
  </div>
)

export default Footer
