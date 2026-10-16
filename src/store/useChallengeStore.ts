import { create } from 'zustand'
import { challengesData } from '../data/challengesData'
import type { Challenge, ConfidenceLevel, ReplayStep, TestResultItem } from '../types/challenge'
import { runPythonChallenge } from '../utils/pythonRunner'
import { useLearningLoopStore } from './useLearningLoopStore'
import { analyzeMistake, getCoachHints, type MistakeCoachAnalysis } from '../services/mistakeCoach'
import type { SenseiState } from '../data/senseiDialogueData'

export interface ChecklistState {
  empty: boolean
  smallest: boolean
  boundary: boolean
  returning: boolean
  unmutated: boolean
}

export interface ChallengeStoreState {
  currentChallenge: Challenge
  code: string
  attemptCount: number
  visibleResults: TestResultItem[]
  hiddenPassedCount: number
  hiddenEvaluatedCount: number
  totalHiddenCount: number
  allPassed: boolean
  isFailed: boolean
  hasRun: boolean
  unlockedHintsCount: number
  confidence: ConfidenceLevel | null
  checklist: ChecklistState
  explanationVisible: boolean
  isDebugReplayOpen: boolean
  replayTimeline: ReplayStep[]
  detectedMistakeCategory: string | null
  coachAnalysis: MistakeCoachAnalysis | null
  coachState: SenseiState
  coachMessage: string | null
  coachHints: [string, string, string] | null
  hintPromptVisible: boolean
  isRunning: boolean
  executionError: string | null

  // Actions
  selectChallenge: (id: string) => void
  setCode: (code: string) => void
  runTests: () => Promise<void>
  unlockHint: () => void
  dismissHintPrompt: () => void
  toggleChecklist: (key: keyof ChecklistState) => void
  setConfidence: (val: ConfidenceLevel) => void
  resetCode: () => void
  toggleDebugReplay: () => void
}

const defaultChecklist: ChecklistState = {
  empty: false,
  smallest: false,
  boundary: false,
  returning: false,
  unmutated: false,
}

const defaultChallenge = challengesData[0]
let activeSubmissionId = 0

export const useChallengeStore = create<ChallengeStoreState>((set, get) => ({
  currentChallenge: defaultChallenge,
  code: defaultChallenge.starterCode,
  attemptCount: 0,
  visibleResults: defaultChallenge.visibleTests.map((t) => ({
    id: t.id,
    inputDesc: t.inputDesc,
    expectedOutput: t.expectedOutput,
    actualOutput: '-',
    status: 'WRONG OUTPUT',
  })),
  hiddenPassedCount: 0,
  hiddenEvaluatedCount: 0,
  totalHiddenCount: defaultChallenge.hiddenTestCount,
  allPassed: false,
  isFailed: false,
  hasRun: false,
  unlockedHintsCount: 0,
  confidence: null,
  checklist: { ...defaultChecklist },
  explanationVisible: false,
  isDebugReplayOpen: false,
  replayTimeline: [],
  detectedMistakeCategory: null,
  coachAnalysis: null,
  coachState: 'idle',
  coachMessage: null,
  coachHints: null,
  hintPromptVisible: false,
  isRunning: false,
  executionError: null,

  selectChallenge: (id: string) => {
    activeSubmissionId += 1
    const found = challengesData.find((c) => c.id === id) ?? defaultChallenge
    set({
      currentChallenge: found,
      code: found.starterCode,
      attemptCount: 0,
      visibleResults: found.visibleTests.map((t) => ({
        id: t.id,
        inputDesc: t.inputDesc,
        expectedOutput: t.expectedOutput,
        actualOutput: '-',
        status: 'WRONG OUTPUT',
      })),
      hiddenPassedCount: 0,
      hiddenEvaluatedCount: 0,
      totalHiddenCount: found.hiddenTestCount,
      allPassed: false,
      isFailed: false,
      hasRun: false,
      unlockedHintsCount: 0,
      confidence: null,
      checklist: { ...defaultChecklist },
      explanationVisible: false,
      isDebugReplayOpen: false,
      replayTimeline: [],
      detectedMistakeCategory: null,
      coachAnalysis: null,
      coachState: 'idle',
      coachMessage: null,
      coachHints: null,
      hintPromptVisible: false,
      isRunning: false,
      executionError: null,
    })
  },

  setCode: (code: string) => set({ code }),

  runTests: async () => {
    const { currentChallenge, code, attemptCount, unlockedHintsCount, replayTimeline, isRunning } = get()
    if (isRunning) return
    const submissionId = ++activeSubmissionId
    const newAttemptCount = attemptCount + 1

    set({ isRunning: true, executionError: null, hintPromptVisible: false })
    let evalResult
    try {
      evalResult = await runPythonChallenge(
        code,
        currentChallenge.functionName,
        currentChallenge.visibleTests,
        currentChallenge.hiddenTests,
      )
    } catch (error) {
      if (submissionId !== activeSubmissionId) return
      set({
        isRunning: false,
        executionError: `The isolated test runner could not start${error instanceof Error ? `: ${error.message}` : '.'}`,
      })
      return
    }
    if (submissionId !== activeSubmissionId) return

    const analysis = evalResult.allPassed
      ? null
      : analyzeMistake(code, currentChallenge, evalResult)

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    const newSteps: ReplayStep[] = [...replayTimeline]

    newSteps.push({
      id: `attempt-${newAttemptCount}`,
      timestamp: now,
      title: `Submission Attempt #${newAttemptCount}`,
      type: 'submit',
      detail: 'Submitted python code to Test Arena.',
      codeSnippet: code,
    })

    if (evalResult.allPassed) {
      newSteps.push({
        id: `pass-${newAttemptCount}`,
        timestamp: now,
        title: 'All Tests Passed',
        type: 'pass',
        detail: `Passed ${evalResult.visibleResults.length} visible and ${evalResult.hiddenPassedCount} hidden edge tests.`,
      })

      // Record success in learning loop store
      useLearningLoopStore.getState().recordSuccess(
        currentChallenge.id,
        currentChallenge.title,
        unlockedHintsCount,
        currentChallenge.xpReward,
        currentChallenge.conceptTags
      )

      set({
        visibleResults: evalResult.visibleResults,
        hiddenPassedCount: evalResult.hiddenPassedCount,
        hiddenEvaluatedCount: evalResult.hiddenEvaluatedCount,
        allPassed: true,
        isFailed: false,
        hasRun: true,
        explanationVisible: false,
        attemptCount: newAttemptCount,
        replayTimeline: newSteps,
        isRunning: false,
        executionError: null,
        coachAnalysis: null,
        coachState: 'happy',
        coachMessage: '🎉 Yes! You found it. Notice what changed? Keep that reasoning with you for the next challenge.',
        hintPromptVisible: false,
      })
    } else {
      const mistakeCat = analysis?.category ?? 'wrong_output'
      const recurrenceCategory = analysis?.recurrenceCategory ?? mistakeCat

      // Record failure in learning loop store
      useLearningLoopStore.getState().recordFailure(
        currentChallenge.id,
        currentChallenge.title,
        recurrenceCategory,
        {
          attemptNumber: newAttemptCount,
          code,
          explanation: analysis?.explanation ?? 'The submission did not match the expected behavior.',
          whyItMatters: analysis?.whyItMatters ?? 'Reliable code handles the behavior described by the task.',
          errorType: mistakeCat,
          hiddenOrVisibleFailure: evalResult.visibleResults.some((result) => result.status !== 'PASS')
            ? 'visible'
            : 'hidden',
        },
      )

      const visibleFailCount = evalResult.visibleResults.filter((result) => result.status !== 'PASS').length
      newSteps.push({
        id: `fail-${newAttemptCount}`,
        timestamp: now,
        title: 'Test Cases Failed',
        type: 'failure',
        detail: visibleFailCount > 0
          ? `Failed ${visibleFailCount} visible test(s).`
          : 'Visible tests passed, but a protected edge case did not.',
      })

      newSteps.push({
        id: `mistake-${newAttemptCount}`,
        timestamp: now,
        title: 'Pattern Identified',
        type: 'mistake',
        detail: `Detected pattern: ${mistakeCat.replace(/_/g, ' ')}.`,
      })

      newSteps.push({
        id: `sensei-${newAttemptCount}`,
        timestamp: now,
        title: 'Sensei Guidance Triggered',
        type: 'sensei',
        detail: analysis?.message ?? currentChallenge.explanation.thinkAboutThis,
      })

      set({
        visibleResults: evalResult.visibleResults,
        hiddenPassedCount: evalResult.hiddenPassedCount,
        hiddenEvaluatedCount: evalResult.hiddenEvaluatedCount,
        allPassed: false,
        isFailed: true,
        hasRun: true,
        explanationVisible: true,
        attemptCount: newAttemptCount,
        detectedMistakeCategory: mistakeCat,
        coachAnalysis: analysis,
        coachState: analysis?.state ?? 'explaining',
        coachMessage: analysis?.message ?? 'Something here is not behaving as expected. Let’s inspect the code together.',
        coachHints: getCoachHints(mistakeCat, [
          '🤔 Trace one small example by hand.',
          'Compare each step with the behavior the task describes.',
          'Check the first point where your reasoning and the task requirements differ.',
        ]),
        hintPromptVisible: unlockedHintsCount < 3,
        isRunning: false,
        executionError: null,
        replayTimeline: newSteps,
      })
    }
  },

  unlockHint: () => {
    const { unlockedHintsCount, currentChallenge, replayTimeline } = get()
    if (unlockedHintsCount >= 3) return

    const nextCount = unlockedHintsCount + 1
    const { detectedMistakeCategory, coachHints } = get()
    const safeFallback: [string, string, string] = [
      '🤔 Trace one small example by hand.',
      'Compare each step with the behavior the task describes.',
      'Check the first point where your reasoning and the task requirements differ.',
    ]
    const hintText = (coachHints ?? getCoachHints(detectedMistakeCategory ?? 'wrong_output', safeFallback))[nextCount - 1] ?? ''
    const hintStates: [SenseiState, SenseiState, SenseiState] = ['hint_1', 'hint_2', 'hint_3']
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })

    useLearningLoopStore.getState().recordHintUsed(currentChallenge.id, nextCount)
    const newSteps: ReplayStep[] = [
      ...replayTimeline,
      {
        id: `hint-${nextCount}`,
        timestamp: now,
        title: `Unlocked Hint Level ${nextCount}`,
        type: 'hint',
        detail: hintText,
      },
    ]

    set({
      unlockedHintsCount: nextCount,
      replayTimeline: newSteps,
      coachState: hintStates[nextCount - 1],
      coachMessage: hintText,
      hintPromptVisible: false,
    })
  },

  dismissHintPrompt: () => set({
    hintPromptVisible: false,
    coachState: 'encouraging',
    coachMessage: 'No rush. Take your time and try your own idea first. I’m right here if you need another nudge.',
  }),

  toggleChecklist: (key: keyof ChecklistState) => {
    const { checklist } = get()
    set({
      checklist: {
        ...checklist,
        [key]: !checklist[key],
      },
    })
  },

  setConfidence: (confidence: ConfidenceLevel) => set({ confidence }),

  resetCode: () => {
    activeSubmissionId += 1
    const { currentChallenge } = get()
    set({
      code: currentChallenge.starterCode,
      hasRun: false,
      allPassed: false,
      isFailed: false,
      explanationVisible: false,
      isRunning: false,
      executionError: null,
      hintPromptVisible: false,
      coachAnalysis: null,
      coachState: 'idle',
      coachMessage: null,
      detectedMistakeCategory: null,
    })
  },

  toggleDebugReplay: () => {
    const { isDebugReplayOpen } = get()
    set({ isDebugReplayOpen: !isDebugReplayOpen })
  },
}))
