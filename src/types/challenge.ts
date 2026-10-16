export type ChallengeDifficulty = 'Easy' | 'Medium' | 'Hard'

export type MistakeCategory =
  | 'off_by_one'
  | 'unhandled_short_input'
  | 'print_not_return'
  | 'boundary_comparison'
  | 'mutates_input'

export type TestResultStatus = 'PASS' | 'WRONG OUTPUT' | 'RUNTIME ERROR' | 'TIMEOUT' | 'RESOURCE LIMIT'

export interface TestCase {
  id: string
  inputDesc: string
  expectedOutput: string
  inputArgs: any[]
}

export interface TestResultItem {
  id: string
  inputDesc: string
  expectedOutput: string
  actualOutput: string
  status: TestResultStatus
  error?: string
}

export interface HiddenTest {
  id: string
  name: string
  inputArgs: any[]
  expectedOutput: any
}

export interface Explanation {
  whatHappened: string
  whereToInvestigate: string
  whyItMatters: string
  thinkAboutThis: string
}

export interface Challenge {
  id: string
  title: string
  difficulty: ChallengeDifficulty
  category: string
  duration: string
  description: string
  learningObjective: string
  conceptTags: string[]
  starterCode: string
  solutionCode: string
  functionName: string
  visibleTests: TestCase[]
  hiddenTestCount: number
  hiddenTests: HiddenTest[]
  hints: [string, string, string] // 3 progressive hint levels
  explanation: Explanation
  mistakeCategories: MistakeCategory[]
  xpReward: number
}

export type ConfidenceLevel = 'Not sure' | 'Somewhat confident' | 'Confident'

export interface ReplayStep {
  id: string
  timestamp: string
  title: string
  type: 'submit' | 'failure' | 'mistake' | 'sensei' | 'hint' | 'pass'
  detail: string
  codeSnippet?: string
}
