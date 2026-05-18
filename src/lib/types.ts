export interface TestCriterion {
  id: string
  text: string
  checked: boolean
  images: string[]
}

export interface TestRequirement {
  id: string
  content: string
  images: string[]
  criteria: TestCriterion[]
  createdAt: number
}

export interface Prerequisite {
  id: string
  description: string
  images: string[]
  createdAt: number
}

export interface TestItem {
  id: string
  name: string
  prerequisites: Prerequisite[]
  requirements: TestRequirement[]
  createdAt: number
}

export interface TestNotebook {
  version: string
  items: TestItem[]
  exportedAt: number
}
