import type { Challenge } from '../types/challenge'
import type { EvaluationResult } from '../utils/pythonRunner'
import type { SenseiState } from '../data/senseiDialogueData'

export interface MistakeCoachAnalysis {
  category: string
  recurrenceCategory: string
  state: SenseiState
  message: string
  explanation: string
  whyItMatters: string
}

interface CoachPattern {
  label: string
  explanation: string
  hints: [string, string, string]
}

const patterns: Record<string, CoachPattern> = {
  syntax_error: {
    label: 'Python syntax',
    explanation: 'Python could not understand the structure of part of this submission.',
    hints: [
      '🤔 Read the changed line slowly. Which symbols separate its parts?',
      'Compare this line with the line above and below it. Is a delimiter or keyword out of place?',
      'Check that every opening delimiter has a matching close and that the statement ends where Python expects.',
    ],
  },
  indentation_error: {
    label: 'Indentation',
    explanation: 'Python uses indentation to determine which statements belong together.',
    hints: [
      '👀 Compare the indentation of this line with the block it belongs to.',
      'Check the lines immediately after a function, loop, or condition.',
      'Make the statements in each block line up consistently with the block they belong to.',
    ],
  },
  missing_quote: {
    label: 'String punctuation',
    explanation: 'A text value may not have matching quotation marks.',
    hints: [
      'Look for a string near the line Python could not parse.',
      'Check whether each opening quote has a matching closing quote.',
      'Compare the quote characters around the text and make sure the string ends before the next expression.',
    ],
  },
  missing_bracket: {
    label: 'Matching delimiters',
    explanation: 'A list, call, or grouped expression may be missing a closing delimiter.',
    hints: [
      '👀 Follow each opening parenthesis, bracket, or brace to its matching close.',
      'Inspect the most recently edited expression and its nesting.',
      'Count the opening and closing delimiters in that expression and check where each group should end.',
    ],
  },
  missing_colon: {
    label: 'Statement punctuation',
    explanation: 'A function, loop, or condition header may be missing punctuation.',
    hints: [
      'Look at the end of each function, loop, and condition header.',
      'Compare the header with another block in the starter code.',
      'Check that the header is clearly separated from the indented body that follows it.',
    ],
  },
  name_error: {
    label: 'Name or variable',
    explanation: 'The code refers to a name Python cannot find in the current scope.',
    hints: [
      'Trace the name in the failing expression back to where it is created.',
      'Compare the spelling and capitalization at the definition and each use.',
      'Check whether the name is assigned before this path tries to use it.',
    ],
  },
  index_error: {
    label: 'List boundary',
    explanation: 'An operation may be reaching a list position that is not available.',
    hints: [
      '🤔 What is the smallest input this operation can receive?',
      'Trace the first and last index used for that input.',
      'Check how the index changes at an empty, short, or boundary-sized input.',
    ],
  },
  type_error: {
    label: 'Value type',
    explanation: 'An operation may be receiving a value of a different kind than it expects.',
    hints: [
      'Identify the values used by the operation that failed.',
      'Check which types the function receives and which type each operation expects.',
      'Trace how each value is created and whether its type changes before the operation.',
    ],
  },
  timeout: {
    label: 'Execution time',
    explanation: 'The program did not finish within the allowed time.',
    hints: [
      'Look for a loop or recursive path that may not make progress.',
      'Trace how the loop condition changes after each iteration.',
      'Check that every repeat path can reach a stopping condition for all supported inputs.',
    ],
  },
  print_not_return: {
    label: 'Return value',
    explanation: 'The function needs to give its result back to its caller, not only display it.',
    hints: [
      'Follow the value from the calculation to the end of the function.',
      'What does the caller receive when this function finishes?',
      'Check whether the computed value leaves the function on every required path.',
    ],
  },
  off_by_one: {
    label: 'Loop boundary',
    explanation: 'The start or stop boundary may include one item too many or too few.',
    hints: [
      'Write down the first and last values the loop visits for a small input.',
      'Compare those values with the first and last items required by the description.',
      'Remember that a Python range stops before its end value; verify the boundary against that rule.',
    ],
  },
  boundary_comparison: {
    label: 'Boundary comparison',
    explanation: 'A boundary value may be treated differently than the task requires.',
    hints: [
      'Test the condition mentally with a value exactly on the boundary.',
      'Compare what the task says about equality with the operator in the condition.',
      'Check whether the boundary value should be included or excluded.',
    ],
  },
  unhandled_short_input: {
    label: 'Short input',
    explanation: 'The logic may assume that an input always contains more elements than it is guaranteed to have.',
    hints: [
      '🤔 What happens when the list is empty or shorter than the requested amount?',
      'Trace the first index or slice boundary for an input smaller than expected.',
      'Check whether each index and boundary remains valid for the smallest allowed input.',
    ],
  },
  mutates_input: {
    label: 'Input mutation',
    explanation: 'An operation may be changing the caller’s original data.',
    hints: [
      'Notice whether the task expects the original collection to remain unchanged.',
      'Trace which operations modify a collection rather than create a result.',
      'Check whether later code or the caller can still observe the original input.',
    ],
  },
  wrong_output: {
    label: 'Logic mismatch',
    explanation: 'The program ran, but its result did not match the required behavior.',
    hints: [
      'Compare the behavior in the description with each step of your logic.',
      'Trace a small example by hand and write down the value after each operation.',
      'Focus on the first point where the value or control flow differs from the task contract.',
    ],
  },
  runtime_error: {
    label: 'Runtime issue',
    explanation: 'The program stopped while it was running. The raw runtime details are kept out of the coach message.',
    hints: [
      'Start at the operation that depends on an input value or collection position.',
      'Trace the values reaching that operation for a small valid input.',
      'Check the assumptions made immediately before the program stops.',
    ],
  },
  zero_division: {
    label: 'Division boundary',
    explanation: 'A divisor may be zero for one of the supported inputs.',
    hints: [
      'Identify where the divisor comes from.',
      'Consider the smallest input that could make that value zero.',
      'Check what behavior the task expects when there is nothing to divide by.',
    ],
  },
  missing_comma: {
    label: 'Separators',
    explanation: 'Python may need a separator between neighboring values or arguments.',
    hints: [
      'Look between the neighboring values on the line Python flagged.',
      'Compare this list or argument group with a similar one in the starter code.',
      'Check whether each value is separated clearly from the next.',
    ],
  },
  extra_comma: {
    label: 'Extra separator',
    explanation: 'There may be a separator where Python expects an item or expression.',
    hints: [
      'Inspect the punctuation at the end of the expression.',
      'Check whether the separator is followed by another value.',
      'Compare the separators in this expression with the surrounding structure.',
    ],
  },
  random_text: {
    label: 'Unexpected text',
    explanation: 'Some text may have been entered where Python expects code.',
    hints: [
      'Take a look at the newest line you changed.',
      'Compare the line with the function structure in the starter code.',
      'Check that the line contains a Python statement or expression in the right place.',
    ],
  },
  undefined_function: {
    label: 'Function definition',
    explanation: 'The expected function could not be found in the submitted code.',
    hints: [
      'Check the function name shown in the task description.',
      'Compare the spelling and indentation of the function header with the starter code.',
      'Make sure the function definition is present at the top level of the submission.',
    ],
  },
  undefined_variable: {
    label: 'Variable name',
    explanation: 'A name is being used before Python can find a matching assignment.',
    hints: [
      'Trace the name in the expression back to where it should be created.',
      'Compare the spelling and capitalization at its definition and use.',
      'Check whether assignment happens before every path that uses the name.',
    ],
  },
  missing_parenthesis: {
    label: 'Parentheses',
    explanation: 'A grouped expression or function call may not have matching parentheses.',
    hints: [
      'Follow the opening parenthesis on the line you changed.',
      'Check where that call or grouped expression should end.',
      'Compare the opening and closing parentheses in the expression, including any nested calls.',
    ],
  },
  extra_parenthesis: {
    label: 'Parentheses',
    explanation: 'There may be a closing parenthesis without a matching opening one.',
    hints: [
      'Look closely at the closing punctuation on the changed line.',
      'Trace each closing parenthesis back to the expression it should close.',
      'Check the nesting from the inside out and remove any unmatched grouping.',
    ],
  },
  invalid_assignment: {
    label: 'Assignment',
    explanation: 'The assignment or comparison symbols may not match the operation intended.',
    hints: [
      'Check whether this line is assigning a value or comparing two values.',
      'Compare the symbols with the operation the task describes.',
      'Inspect the full expression to ensure assignment and comparison operators are used in the right context.',
    ],
  },
  invalid_operator: {
    label: 'Operator',
    explanation: 'The operator in this expression may not be valid for the values or task.',
    hints: [
      'Identify the operation this expression is meant to perform.',
      'Check whether the selected operator fits the types of values involved.',
      'Compare the operator with the task’s wording and the nearby expression structure.',
    ],
  },
  memory_limit: {
    label: 'Memory limit',
    explanation: 'The run used more memory than the isolated evaluator allows.',
    hints: [
      'Look for a collection or repeated result that grows unexpectedly.',
      'Trace how many values the code can create for a large input.',
      'Check whether intermediate data can be processed without keeping every copy at once.',
    ],
  },
  output_limit: {
    label: 'Output limit',
    explanation: 'The run produced more output than the evaluator can safely process.',
    hints: [
      'Check whether a loop or repeated operation creates an unusually large result.',
      'Trace how the amount of returned data grows with the input size.',
      'Make sure the function returns only the data required by the task.',
    ],
  },
  disk_limit: {
    label: 'Storage limit',
    explanation: 'The isolated evaluator could not safely accommodate the program’s storage use.',
    hints: [
      'Look for code that repeatedly creates or writes data.',
      'Trace how much data can accumulate during one run.',
      'Check whether the task can be completed without storing unnecessary intermediate data.',
    ],
  },
  attribute_error: {
    label: 'Attribute or method',
    explanation: 'A value may not support the property or method being used.',
    hints: [
      'Identify the type of value immediately before the property or method call.',
      'Check whether that value provides the operation you are calling.',
      'Trace whether an earlier expression might return a different kind of value than expected.',
    ],
  },
  key_error: {
    label: 'Dictionary key',
    explanation: 'A dictionary lookup may be requesting a key that is not present.',
    hints: [
      'Check which keys the dictionary is guaranteed to contain.',
      'Trace where the requested key comes from.',
      'Consider how the task expects the code to behave when that key is absent.',
    ],
  },
  incorrect_accumulator: {
    label: 'Accumulator logic',
    explanation: 'A value being built across a loop may be replaced instead of accumulated.',
    hints: [
      'Follow the collection or total from its initialization through each loop pass.',
      'Check whether the loop keeps earlier progress or replaces it with the current item.',
      'Compare the value before and after two iterations to see whether the result is being built.',
    ],
  },
  incorrect_string_handling: {
    label: 'String handling',
    explanation: 'The code separates and rejoins the words, but the requested per-word transformation may be missing.',
    hints: [
      'Trace one word from the input through the loop.',
      'Compare the word before it is added to the result with the transformation the task asks for.',
      'Check the characters within each word separately from the order of the words.',
    ],
  },
  incorrect_transformation: {
    label: 'Value transformation',
    explanation: 'The code selects the intended values but may not apply the requested change to each one.',
    hints: [
      'Trace one selected value from the input to the returned collection.',
      'Compare the value added to the result with the transformation in the task description.',
      'Check the expression used to create each result item.',
    ],
  },
}

const syntaxErrorTypes = [
  'syntax_error',
  'indentation_error',
  'missing_quote',
  'missing_bracket',
  'missing_colon',
] as const

function classifySyntax(code: string, error: string): string {
  const normalizedError = error.toLowerCase()
  if (/indentation|unexpected indent|unindent/.test(normalizedError)) return 'indentation_error'
  if (/unterminated string|unexpected end of input/.test(normalizedError)) return 'missing_quote'
  if (/unexpected token/.test(normalizedError) && /[?@#$]/.test(code)) return 'random_text'
  if (/\bdef\s+\w+\s*\([^)]*\b\w+\s+\w+\b[^,)]*\)/.test(code)) return 'missing_comma'
  if (/,\s*[)\]]/.test(code)) return 'extra_comma'
  if (/==\s*=|=\s*==/.test(code)) return 'invalid_assignment'
  if (/[+\-*/]{3,}|[<>]{3,}/.test(code)) return 'invalid_operator'

  const quoteCounts = ["'", '"'].map((quote) =>
    [...code].reduce((count, char, index) => count + (char === quote && code[index - 1] !== '\\' ? 1 : 0), 0)
  )
  if (quoteCounts.some((count) => count % 2 !== 0)) return 'missing_quote'

  const delimiters: Record<string, string> = { ')': '(', ']': '[', '}': '{' }
  const stack: string[] = []
  let hasExtraDelimiter = false
  for (const char of code) {
    if (char === '(' || char === '[' || char === '{') stack.push(char)
    if (char in delimiters && stack.pop() !== delimiters[char]) hasExtraDelimiter = true
  }
  if (hasExtraDelimiter) return 'extra_parenthesis'
  if (stack.length > 0) return stack[stack.length - 1] === '(' ? 'missing_parenthesis' : 'missing_bracket'
  if (/\b(def|if|elif|else|for|while|try|except|class)\b[^:\n]*\n/.test(code)) return 'missing_colon'

  return syntaxErrorTypes[0]
}

function categorizeRuntime(result: EvaluationResult): string {
  if (result.hasIndexError) return 'index_error'
  if (result.hasTypeError) return 'type_error'

  const messages = result.visibleResults.map((item) => (item.error ?? '').toLowerCase()).join(' ')
  if (/nameerror|not defined|is not defined/.test(messages)) return 'undefined_variable'
  if (/zerodivision|division by zero/.test(messages)) return 'zero_division'
  if (/attributeerror|has no attribute/.test(messages)) return 'attribute_error'
  if (/keyerror/.test(messages)) return 'key_error'
  return 'runtime_error'
}

function classifyLogic(code: string, challenge: Challenge, result: EvaluationResult): string {
  const categories = challenge.mistakeCategories
  if (result.hasMutatedInput && categories.includes('mutates_input')) return 'mutates_input'
  if (
    /\bsplit\s*\(/.test(code) &&
    /\.append\s*\(\s*[a-zA-Z_]\w*\s*\)/.test(code) &&
    /reverse_words/.test(challenge.functionName)
  ) {
    return 'incorrect_string_handling'
  }
  if (/\bflat\s*=\s*pair\b/.test(code)) return 'incorrect_accumulator'
  if (
    /\bresult\.append\s*\(\s*x\s*\)/.test(code) &&
    /double_positives/.test(challenge.functionName)
  ) {
    return 'incorrect_transformation'
  }
  if (
    categories.includes('unhandled_short_input') &&
    (
      /len\s*\([^)]*\)\s*-\s*\w+/.test(code) ||
      /\w+\s*\[\s*-\s*\d/.test(code) ||
      (/\brange\s*\(\s*len\s*\(/.test(code) && /\[\s*i\s*\+\s*1\s*\]/.test(code))
    )
  ) {
    return 'unhandled_short_input'
  }
  if (categories.includes('off_by_one') && /\[\s*[a-zA-Z_]\w*\s*-\s*\d+\s*:\s*[^\]]+\]/.test(code)) {
    return 'off_by_one'
  }
  if (categories.includes('boundary_comparison') && /(?:<|>|==)\s*=|[<>]=?/.test(code)) {
    return 'boundary_comparison'
  }
  if (categories.includes('off_by_one') && /\brange\s*\(/.test(code)) return 'off_by_one'
  return categories[0] ?? 'wrong_output'
}

function getPattern(category: string): CoachPattern {
  if (patterns[category]) return patterns[category]
  const label = category.replace(/_/g, ' ')
  return {
    label,
    explanation: `This submission shows a ${label} issue. The raw evaluator details are kept out of the coach message.`,
    hints: [
      '🤔 Trace a small example and notice where the behavior first differs from what you expect.',
      'Look at the values and assumptions used immediately before that point.',
      'Check how the operation behaves for the smallest and boundary inputs described by the task.',
    ],
  }
}

export function analyzeMistake(
  code: string,
  challenge: Challenge,
  result: EvaluationResult,
): MistakeCoachAnalysis {
  let category: string
  let state: SenseiState

  if (result.resourceLimitCategory) {
    category = result.resourceLimitCategory
    state = 'runtime_error'
  } else if (result.hasTimeout) {
    category = 'timeout'
    state = 'timeout'
  } else if (result.primaryError) {
    if (!/\bdef\b/.test(code) && code.trim()) {
      category = 'random_text'
      state = 'error_detected'
    } else {
      category = /function could not be found/i.test(result.primaryError)
        ? 'undefined_function'
        : classifySyntax(code, result.primaryError)
      state = category === 'undefined_function' ? 'runtime_error' : 'error_detected'
    }
  } else if (result.visibleResults.some((item) => item.status === 'TIMEOUT')) {
    category = 'timeout'
    state = 'timeout'
  } else if (result.visibleResults.some((item) => item.status === 'RUNTIME ERROR')) {
    category = categorizeRuntime(result)
    state = 'runtime_error'
  } else if (!new RegExp(`\\bdef\\s+${challenge.functionName}\\s*\\(`).test(code)) {
    category = code.trim() && !/\bdef\b/.test(code) ? 'random_text' : 'undefined_function'
    state = 'runtime_error'
  } else if (result.hasPrintNotReturn) {
    category = 'print_not_return'
    state = 'notice'
  } else {
    category = classifyLogic(code, challenge, result)
    state = 'explaining'
  }

  const pattern = getPattern(category)
  const isSyntax = syntaxErrorTypes.includes(category as (typeof syntaxErrorTypes)[number]) ||
    ['missing_parenthesis', 'extra_parenthesis', 'extra_comma', 'missing_comma', 'random_text', 'invalid_assignment', 'invalid_operator'].includes(category)
  const message = isSyntax
    ? `😅 Oops! ${pattern.explanation} Take another look at the punctuation and structure you just changed. Want a small hint?`
    : category === 'timeout'
      ? '⏱️ This run took longer than expected. Check whether each loop or repeated step can eventually finish. Want a small hint?'
      : result.resourceLimitCategory
        ? `The evaluator stopped this run because it reached ${/^[aeiou]/i.test(pattern.label) ? 'an' : 'a'} ${pattern.label.toLowerCase()}. ${pattern.explanation} Want a small hint?`
    : result.visibleResults.every((item) => item.status === 'PASS') && !result.allPassed
      ? `Your visible examples pass 👍, but a protected edge case still differs. ${pattern.explanation} Let's inspect the assumptions together. Want a small hint?`
      : category === 'wrong_output' || category === 'incorrect_loop_range'
      ? `Your code runs 👍, so the Python syntax is okay. The result does not match the task yet. ${pattern.explanation} Want a small hint?`
      : `👀 I noticed ${/^[aeiou]/i.test(pattern.label) ? 'an' : 'a'} ${pattern.label.toLowerCase()} issue. ${pattern.explanation} Let's inspect that part together. Want a small hint?`

  return {
    category,
    recurrenceCategory: category,
    state,
    message,
    explanation: pattern.explanation,
    whyItMatters: 'Reliable code handles the full range of inputs described by the task, including small and boundary cases.',
  }
}

export function getCoachHints(category: string, fallback: [string, string, string]): [string, string, string] {
  return patterns[category]?.hints ?? fallback
}
