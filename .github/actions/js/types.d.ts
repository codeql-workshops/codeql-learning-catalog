type ProgramPriority = 1 | 2 | 3 | 4 | 5
type ProgramMilestone = {
  type: string
  label: string
  date: `${number}-${number}-${number}`
}

type ProgramReport = {
  // set by user
  status: string
  summary_overall: string
  summary_looking_back: string
  summary_looking_forward: string
  summary_needs: string
  customer_date_changed: 'Yes' | 'No' | ''

  // meta data
  id: number
  url: string
  created_at: string
  created_by: string
  updated_at: string
  updated_by: string
  index: number
  previous: Omit<ProgramReport, 'index' | 'previous'>[]
}

export type ProgramReportEvent = {
  type: 'created' | 'edited' | 'deleted'
  program: Program
  report: ProgramReport
}

type MinimalProgram = {
  /** program issue number - read only */
  id: number
  /** program slug, matches the path - read only */
  slug: string

  /** Program name - set by user in data.yml */
  name: string

  /** Program priority - set by user in data.yml */
  priority: ProgramPriority

  /** Program manager github login (without the @) - set by user in data.yml */
  program_manager: string

  /** Program directly responsible individual (DRI) github login (without the @) - set by user in data.yml */
  dri: string

  /** Program team - set by user in data.yml */
  team: string

  /** Program team - set by user in data.yml */
  theme: string

  /** The program's next milestone - derived from milestones in data.yml */
  nextMilestone?: ProgramMilestone
}

export type Program = MinimalProgram & {
  /** full program path - added when program is retrieved */
  path: string
  /** full path to program plan file - added when program is retrieved */
  program_plan_url: string

  /** List of milestones with names and dates - set by user in data.yml */
  milestones: ProgramMilestone[]

  /** Links to external program resources */
  links: {
    backlog?: string
    decisionLog?: string
    okrs?: string
    releases?: string
    riskRegister?: string
    roadmap?: string
    schedule?: string
  }
}

export type ProgramReportEvent = {
  type: 'created' | 'edited' | 'deleted'
  program: Program
  report: ProgramReport & {
    index: number
    previous: ProgramReport[]
  }
}

/** Programs Dashboard event */
export type ProgramsDashboardEvent = {
  createdAt: string
  publishedAt: string
  publishedBy: string
  url: string
  programsWithReport: {
    program: MinimalProgram
    report: Omit<ProgramReport, 'index' | 'previous'>
  }[]
  numProgramsWithoutReport: number
  isTruncated: boolean
}
