import {FC} from 'react'
import {useRouter} from 'next/router'
import {
  PencilIcon,
  IssueOpenedIcon,
  DeviceDesktopIcon,
  ReportIcon,
  RocketIcon,
  DeviceCameraVideoIcon
} from '@primer/octicons-react'
import Breadcrumbs from './Breadcrumbs'
import {repo, siteUrl} from '../codeql-learning-catalog.config.js'
import {metadataForCoursePage} from '../src/util/docs'

export interface Props {
  workshopPath: string
  language?: string
  feedback?: string
  deck?: string
  recording?: string
  isIndex?: boolean
}

const WorkshopMetadataActionBar: FC<Props> = ({
  workshopPath,
  language,
  feedback,
  deck,
  recording,
  isIndex
}) => {
  const router = useRouter()

  // Survey | Slides | View Workshop
  return (
    <div className="d-md-flex flex-items-center flex-justify-end  mt-4 flex-items">
      <div className="BtnGroup mt-3 mt-sm-0">
        {feedback?.startsWith('http') && (
          <a
            title="View or submit workshop feedback"
            href={feedback}
            role="button"
            className="BtnGroup-item btn"
            target="_blank"
            rel="noopener"
          >
            <ReportIcon />
            <span>Workshop Survey</span>
          </a>
        )}

        {deck?.startsWith('http') && (
          <a
            href={deck}
            role="button"
            title="View workshop slides"
            className="BtnGroup-item btn"
            target="_blank"
            rel="noopener"
          >
            <DeviceDesktopIcon />
            <span>View Slides</span>
          </a>
        )}

        {recording?.startsWith('http') && (
          <a
            href={deck}
            role="button"
            title="View workshop recording"
            className="BtnGroup-item btn"
            target="_blank"
            rel="noopener"
          >
            <DeviceCameraVideoIcon />
            <span>View Recording</span>
          </a>
        )}

        {isIndex && (
          <a
            title="Go to workshop"
            href={workshopPath}
            role="button"
            className="BtnGroup-item btn"
            target="_blank"
            rel="noopener"
          >
            <RocketIcon />
            <span>Start Workshop</span>
          </a>
        )}

        {!isIndex && (
          <a
            title="Go to workshop"
            href={workshopPath}
            role="button"
            className="BtnGroup-item btn"
            target="_blank"
            rel="noopener"
          >
            <RocketIcon />
            <span>Go To Workshop</span>
          </a>
        )}
      </div>
    </div>
  )
}

export default WorkshopMetadataActionBar
