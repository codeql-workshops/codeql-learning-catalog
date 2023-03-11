import {FC} from 'react'
import {format, formatDistanceToNowStrict} from 'date-fns'
import Octicon from './Octicon'
import HandleLinker from './HandleLinker'
import markdownToHtml from '../src/util/markdownToHtml'

export const InitiativeSidebarHeader: FC = ({children}) => (
  <h4 className="text-small text-uppercase color-fg-subtle mb-2">{children}</h4>
)

export interface Props {
  frontMatter: {
    initiative: {
      status: string // status shield url
      tpm_program_id: 234 // issue number of the program's intake issue
      tpm_update_url: string
      tpm_update_date: Date
      program_report_summary: string
      program_report_customer_date_changed: 'Yes' | 'No' | ''
      dri: string
      up_next: string
      leads: {
        engineering: string
        product: string
        design: string
        tpm: string
        pmm: string
      }
      teams: string[]
      sponsor: string
      reviews: [
        {
          date: Date
          doc: string
        }
      ]
      links: [
        {
          name: string
          url: string
        }
      ]
    }
  }
}

const InitiativeSidebar: FC<Props> = ({frontMatter: {initiative}}) => (
  <div className="Box Box--spacious color-bg-subtle">
    <div className="Box-body">
      <InitiativeSidebarHeader>Status</InitiativeSidebarHeader>

      <p>
        {initiative.tpm_update_url ? (
          <a href={initiative.tpm_update_url}>
            <img src={initiative.status} />
          </a>
        ) : (
          <img src={initiative.status} />
        )}
      </p>

      {initiative.program_report_customer_date_changed === 'Yes' && (
        <p>📅 Major customer facing date changed</p>
      )}

      {initiative.tpm_update_date && (
        <p>
          <strong>Last Update:</strong>
          <br />
          <a href={initiative.tpm_update_url}>
            {formatDistanceToNowStrict(new Date(initiative.tpm_update_date), {
              addSuffix: true
            })}
          </a>
        </p>
      )}

      {initiative.program_report_summary && (
        <p>
          <strong>TLDR:</strong>
          <br />
          {/* .slice() removes the surrounding <p> and </p> tags */}
          <span
            dangerouslySetInnerHTML={{
              __html: markdownToHtml(initiative.program_report_summary).slice(
                3,
                -4
              )
            }}
          />
        </p>
      )}

      <p>
        <strong>🎯 Up next:</strong>
        <br />
        {initiative.up_next}
      </p>

      <hr />

      <InitiativeSidebarHeader>People</InitiativeSidebarHeader>

      <ul className="list-style-none">
        <li>
          <strong>DRI:</strong> <HandleLinker input={initiative.dri} />
        </li>
        <li>
          <strong>Engineering:</strong>{' '}
          <HandleLinker input={initiative.leads.engineering} />
        </li>
        <li>
          <strong>Product:</strong>{' '}
          <HandleLinker input={initiative.leads.product} />
        </li>
        <li>
          <strong>Design:</strong>{' '}
          <HandleLinker input={initiative.leads.design} />
        </li>
        <li>
          <strong>TPM:</strong> <HandleLinker input={initiative.leads.tpm} />
        </li>
        <li>
          <strong>PMM:</strong> <HandleLinker input={initiative.leads.pmm} />
        </li>
      </ul>

      <p className="mt-3">
        <strong>Teams:</strong>
        <br />
        {initiative.teams.join(', ')}
      </p>

      {initiative.reviews && (
        <>
          <hr />
          <InitiativeSidebarHeader>Review</InitiativeSidebarHeader>

          <ul className="list-style-none">
            <li>
              <strong>Last reviewed:</strong>{' '}
              {formatDistanceToNowStrict(new Date(initiative.reviews[0].date))}
            </li>
            <li>
              <strong>Executive sponsor:</strong>{' '}
              <HandleLinker input={initiative.sponsor} />
            </li>
          </ul>
          <br />

          <p>
            <strong>Reviews:</strong>
          </p>

          <ul className="list-style-none my-3">
            {initiative.reviews.map(review => (
              <li key={review.date.toString()}>
                <a href={review.doc}>
                  <Octicon name="file" height={16} />{' '}
                  {format(new Date(review.date), 'P')}
                </a>
              </li>
            ))}
          </ul>

          <p>
            <small>
              Learn more about <a href="#">the review process</a>.
            </small>
          </p>
        </>
      )}

      {initiative.links && (
        <>
          <hr />

          <InitiativeSidebarHeader>Links</InitiativeSidebarHeader>

          <ul className="list-style-none">
            {initiative.links.map(
              link =>
                link.url && (
                  <li key={`link-${link.name}`}>
                    <a href={link.url}>{link.name}</a>
                  </li>
                )
            )}
          </ul>
        </>
      )}
    </div>
  </div>
)

export default InitiativeSidebar
