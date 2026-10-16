import type { MistakeCategory } from '../types/challenge'

export interface MistakeTaxonomyInfo {
  id: MistakeCategory
  label: string
  shortTitle: string
  plainExplanation: string
  targetConcepts: string[]
  sampleQuestion: string
}

export const mistakeTaxonomyMap: Record<MistakeCategory, MistakeTaxonomyInfo> = {
  unhandled_short_input: {
    id: 'unhandled_short_input',
    label: 'UNHANDLED SHORT INPUT',
    shortTitle: 'Short Input Assumption',
    plainExplanation: 'Learn to recognize when your code assumes the input list contains more elements than guaranteed.',
    targetConcepts: ['Lists', 'Boundaries', 'Indexing'],
    sampleQuestion: 'What happens if len(marks) is 0 or smaller than k?',
  },
  off_by_one: {
    id: 'off_by_one',
    label: 'OFF-BY-ONE INDEXING',
    shortTitle: 'Off-By-One Boundary',
    plainExplanation: 'Your loop or range stops one item too early or starts one index too late.',
    targetConcepts: ['Loops', 'Range', 'Indexing'],
    sampleQuestion: 'Does range(1, n) include n or stop at n - 1?',
  },
  print_not_return: {
    id: 'print_not_return',
    label: 'PRINT INSTEAD OF RETURN',
    shortTitle: 'Console Print vs Return',
    plainExplanation: 'The function displays output to the terminal instead of returning a value to caller functions.',
    targetConcepts: ['Functions', 'Return Values'],
    sampleQuestion: 'Does print(x) send the result back to caller code?',
  },
  boundary_comparison: {
    id: 'boundary_comparison',
    label: 'BOUNDARY COMPARISON',
    shortTitle: 'Inclusive vs Strict Comparison',
    plainExplanation: 'Confusing inclusive (>=) and strict (>) inequality checks on edge boundary values.',
    targetConcepts: ['Conditionals', 'Boundaries'],
    sampleQuestion: 'Is mark = 40 considered passing when checking mark >= 40 vs mark > 40?',
  },
  mutates_input: {
    id: 'mutates_input',
    label: 'INPUT WAS MODIFIED',
    shortTitle: 'In-Place Input Mutation',
    plainExplanation: 'Modifying the caller list directly leads to unexpected side effects on subsequent operations.',
    targetConcepts: ['Lists', 'Immutability'],
    sampleQuestion: 'Are you returning a new list or destroying caller data?',
  },
}
