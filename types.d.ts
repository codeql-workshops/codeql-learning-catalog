declare module '*/codeql-learning-catalog.config.js' {
  import {IconName} from '@primer/octicons'
  interface secondaryLinks {
    text: string
    url: string
    icon: IconName
  }

  export const siteUrl: string

  export const repo: {
    url: string
    branch: string
  }

  export const topLevelNav: number[]

  export const lowerLevelNav: secondaryLinks[]
}

declare module '*/_data/business-updates.yml' {
  import {IconName} from '@primer/octicons'
  const updates: [
    {
      title: string
      url: string
      icon: IconName
    }
  ]
  export default updates
}

declare module '*/_data/resources.yml' {
  const resources: [
    {
      title: string
      url: string
    }
  ]
  export default resources
}

declare module '*/_data/readme-project.yml' {
  import {IconName} from '@primer/octicons'
  const links: [
    {
      title: string
      url: string
      date: Date
      icon: IconName
    }
  ]
  export default links
}
