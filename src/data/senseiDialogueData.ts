export type SenseiState =
  | 'idle'
  | 'speaking'
  | 'thinking'
  | 'warning'
  | 'hint'
  | 'success'
  | 'mastery'
  | 'recurring'
  | 'observing'
  | 'encouraging'
  | 'explaining'
  | 'notice'
  | 'error_detected'
  | 'happy'
  | 'hint_1'
  | 'hint_2'
  | 'hint_3'
  | 'timeout'
  | 'runtime_error'

export const defaultSenseiDialogues: Record<SenseiState, string> = {
  idle: 'Take your time. Read the problem before touching the code.',
  speaking: 'Before you run it, read the function contract carefully.',
  thinking: "Look carefully. Something in this behavior doesn't match the contract.",
  observing: 'Take your time. Read the contract before you touch the code.',
  warning: "Don't jump to the fix yet. Find the assumption that caused the failure.",
  hint: 'Trace the boundary. What happens when the input is smaller than expected?',
  success: 'You found it. Notice what assumption was wrong.',
  mastery: 'Your handling of boundaries is getting stronger.',
  recurring: "This is familiar. You've seen this kind of mistake before.",
  encouraging: "The best debuggers notice what others miss. You're learning to do exactly that.",
  explaining: 'Good. The failure tells us where to look.',
  notice: 'I noticed something worth checking. Let’s take a closer look.',
  error_detected: '😅 Oops! Something in the code needs another look.',
  happy: '🎉 Yes! You found it. Notice what changed?',
  hint_1: 'Here is a small nudge to help you investigate.',
  hint_2: 'Let’s narrow down the reasoning a little more.',
  hint_3: 'One final clue. You can discover the fix from here.',
  timeout: 'This run took longer than expected. Let’s check whether each loop can finish.',
  runtime_error: 'Something stopped while the code was running. Let’s inspect the operation that depends on the input.',
}

export const senseiStateLabels: Record<SenseiState, string> = {
  idle: 'Coaching',
  speaking: 'Coaching',
  thinking: 'Analyzing',
  observing: 'Observing',
  warning: 'Investigation',
  hint: 'Hint',
  success: 'Bug Found',
  mastery: 'Mastery',
  recurring: 'Pattern Recognized',
  encouraging: 'Coaching',
  explaining: 'Unpacking',
  notice: 'Coach noticed',
  error_detected: 'Syntax check',
  happy: 'Progress',
  hint_1: 'Hint 1',
  hint_2: 'Hint 2',
  hint_3: 'Hint 3',
  timeout: 'Time limit',
  runtime_error: 'Runtime check',
}
