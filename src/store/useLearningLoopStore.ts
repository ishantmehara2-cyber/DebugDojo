import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { challengesData } from '../data/challengesData'
import type { Challenge } from '../types/challenge'

export interface MistakeLogEntry {
  id: string
  challengeId: string
  challengeTitle: string
  category: string
  timestamp: string
  date: string
  createdAt?: string
  updatedAt?: string
  mistakeDetectedAt?: string
  resolvedAt?: string
  concepts?: string[]
  hintsUsed?: number
  status?: 'still-practicing' | 'improving' | 'resolved'
  reviewed?: boolean
  learnerId?: string
  concept?: string
  severity?: 'low' | 'medium' | 'high'
  codeSnapshot?: string
  relevantCodeContext?: string
  errorType?: string
  explanation?: string
  whyItMatters?: string
  hintLevelUsed?: number
  resolved?: boolean
  attemptNumber?: number
  recurrenceCount?: number
  hiddenOrVisibleFailure?: 'visible' | 'hidden'
  recommendedPractice?: string
}

export interface MistakeFailureDetails {
  attemptNumber: number
  code: string
  explanation: string
  whyItMatters: string
  errorType: string
  hiddenOrVisibleFailure: 'visible' | 'hidden'
}

export interface ChallengeCompletionRecord {
  challengeId: string
  challengeTitle: string
  passType: 'independent' | 'hint-assisted'
  hintsUsed: number
  date: string
}

export interface ConceptMasteryRecord {
  name: string
  mastery: number
  independentPasses: number
  hintPasses: number
  trend: string
}

export interface AchievementItem {
  id: string
  title: string
  desc: string
  date: string
}

export interface NotificationItem {
  id: string
  title: string
  message: string
  type: 'achievement' | 'pattern'
}

interface LearningLoopState {
  mistakeLogs: MistakeLogEntry[]
  completedChallenges: Record<string, ChallengeCompletionRecord>
  conceptMastery: Record<string, ConceptMasteryRecord>
  unlockedAchievements: Record<string, AchievementItem>
  notification: NotificationItem | null

  // Actions
  recordFailure: (
    challengeId: string,
    challengeTitle: string,
    category: string,
    details?: MistakeFailureDetails
  ) => void
  recordHintUsed: (challengeId: string, hintLevel: number) => void
  deleteMistake: (mistakeId: string) => void
  markMistakeReviewed: (mistakeId: string) => void
  recordSuccess: (
    challengeId: string,
    challengeTitle: string,
    hintsUsed: number,
    xpReward: number,
    conceptTags: string[]
  ) => void
  dismissNotification: () => void

  // Derived helpers
  getCategoryStats: (category: string) => {
    occurrences: number
    distinctChallengesCount: number
    challenges: Array<{ id: string; title: string }>
    isRecurring: boolean
  }
  getRecurringCategories: () => string[]
  getRecommendedChallenge: () => { challenge: Challenge; reason: string }
}

const defaultMastery: Record<string, ConceptMasteryRecord> = {
  Lists: { name: 'Lists', mastery: 72, independentPasses: 4, hintPasses: 2, trend: '+6% this week' },
  Indexing: { name: 'Indexing', mastery: 61, independentPasses: 3, hintPasses: 2, trend: '+4% this week' },
  Boundaries: { name: 'Boundaries', mastery: 48, independentPasses: 2, hintPasses: 3, trend: '+8% this week' },
  Functions: { name: 'Functions', mastery: 83, independentPasses: 6, hintPasses: 1, trend: '+5% this week' },
  Loops: { name: 'Loops', mastery: 78, independentPasses: 5, hintPasses: 1, trend: '+3% this week' },
}

const defaultAchievements: Record<string, AchievementItem> = {
  'first-debug': {
    id: 'first-debug',
    title: 'FIRST DEBUG',
    desc: 'Solved your first challenge in the arena.',
    date: 'Earned Oct 10',
  },
  'edge-detective': {
    id: 'edge-detective',
    title: 'EDGE CASE DETECTIVE',
    desc: 'Correctly handled a boundary condition.',
    date: 'Earned Oct 12',
  },
  'independent-thinker': {
    id: 'independent-thinker',
    title: 'INDEPENDENT THINKER',
    desc: 'Solved 3 challenges without hints.',
    date: 'Earned Oct 15',
  },
}

function redactSensitiveCode(code: string): string {
  return code
    .split('\n')
    .map((line) =>
      line.replace(
        /\b(password|passwd|token|secret|api[_-]?key|access[_-]?key)\b(\s*[:=]\s*).+/i,
        '$1$2[redacted]',
      ),
    )
    .join('\n')
    .slice(0, 12000)
}

export const useLearningLoopStore = create<LearningLoopState>()(
  persist(
    (set, get) => ({
      mistakeLogs: [],
      completedChallenges: {},
      conceptMastery: defaultMastery,
      unlockedAchievements: defaultAchievements,
      notification: null,

      dismissNotification: () => set({ notification: null }),

      recordFailure: (challengeId, challengeTitle, category, details) => {
        const { mistakeLogs } = get()
        const now = new Date()
        const nowIso = now.toISOString()
        const safeCode = details ? redactSensitiveCode(details.code) : undefined
        const relevantCodeContext = safeCode
          ?.split('\n')
          .filter((line) => line.trim())
          .slice(-5)
          .join('\n')
        const currentChallenge = challengesData.find((challenge) => challenge.id === challengeId)
        const recommendedPractice = challengesData.find(
          (challenge) =>
            challenge.id !== challengeId &&
            challenge.mistakeCategories.some((challengeCategory) => challengeCategory === category),
        )?.id ?? challengesData.find((challenge) =>
          challenge.id !== challengeId &&
          challenge.conceptTags.some((tag) => currentChallenge?.conceptTags.includes(tag)),
        )?.id ?? challengesData.find((challenge) => challenge.id !== challengeId)?.id
        const recurrenceCount = new Set([
          ...mistakeLogs
            .filter((entry) => entry.category === category)
            .map((entry) => entry.challengeId),
          challengeId,
        ]).size

        const newLog: MistakeLogEntry = {
          id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          challengeId,
          challengeTitle,
          category,
          timestamp: nowIso,
          date: 'Today',
          createdAt: nowIso,
          updatedAt: nowIso,
          mistakeDetectedAt: nowIso,
          concepts: currentChallenge?.conceptTags ?? [],
          hintsUsed: 0,
          status: 'still-practicing',
          reviewed: false,
          learnerId: 'local-learner',
          concept: currentChallenge?.conceptTags.join(', '),
          severity: category === 'timeout' || category === 'memory_limit' ? 'high' : 'medium',
          codeSnapshot: safeCode,
          relevantCodeContext,
          errorType: details?.errorType ?? category,
          explanation: details?.explanation,
          whyItMatters: details?.whyItMatters,
          hintLevelUsed: 0,
          resolved: false,
          attemptNumber: details?.attemptNumber,
          recurrenceCount,
          hiddenOrVisibleFailure: details?.hiddenOrVisibleFailure,
          recommendedPractice,
        }

        const updatedLogs = [newLog, ...mistakeLogs]

        const distinctMap = new Map<string, string>()
        updatedLogs
          .filter((entry) => entry.category === category)
          .forEach((entry) => {
            distinctMap.set(entry.challengeId, entry.challengeTitle)
          })

        const updatedChallengeCount = distinctMap.size
        let newNotification: NotificationItem | null = null

        if (updatedChallengeCount >= 2) {
          const currentDistinctChallenges = new Set(
            mistakeLogs
              .filter((entry) => entry.category === category)
              .map((entry) => entry.challengeId)
          )

          if (!currentDistinctChallenges.has(challengeId)) {
            newNotification = {
              id: `notif-${Date.now()}`,
              title: 'PATTERN DETECTED',
              message: `You've encountered ${category.replace(/_/g, ' ')} across 2 different challenges.`,
              type: 'pattern',
            }
          }
        }

        set({
          mistakeLogs: updatedLogs,
          ...(newNotification ? { notification: newNotification } : {}),
        })
      },

      recordHintUsed: (challengeId, hintLevel) => {
        const { mistakeLogs } = get()
        const targetIndex = mistakeLogs.findIndex(
          (entry) => entry.challengeId === challengeId && entry.resolved !== true,
        )
        if (targetIndex === -1) return
        const updatedLogs = [...mistakeLogs]
        updatedLogs[targetIndex] = {
          ...updatedLogs[targetIndex],
          hintLevelUsed: Math.max(updatedLogs[targetIndex].hintLevelUsed ?? 0, hintLevel),
          hintsUsed: Math.max(updatedLogs[targetIndex].hintsUsed ?? 0, hintLevel),
          status: 'improving',
          updatedAt: new Date().toISOString(),
        }
        set({ mistakeLogs: updatedLogs })
      },

      deleteMistake: (mistakeId) => {
        set((state) => ({
          mistakeLogs: state.mistakeLogs.filter((entry) => entry.id !== mistakeId),
        }))
      },

      markMistakeReviewed: (mistakeId) => {
        const now = new Date().toISOString()
        set((state) => ({
          mistakeLogs: state.mistakeLogs.map((entry) =>
            entry.id === mistakeId ? { ...entry, reviewed: true, updatedAt: now } : entry,
          ),
        }))
      },

      recordSuccess: (challengeId, challengeTitle, hintsUsed, _xpReward, conceptTags) => {
        const { completedChallenges, conceptMastery, unlockedAchievements, mistakeLogs } = get()
        const isIndependent = hintsUsed === 0
        const dateStr = 'Today'
        const now = new Date().toISOString()

        const newRecord: ChallengeCompletionRecord = {
          challengeId,
          challengeTitle,
          passType: isIndependent ? 'independent' : 'hint-assisted',
          hintsUsed,
          date: dateStr,
        }

        // Update Mastery for tags
        const updatedMastery = { ...conceptMastery }
        conceptTags.forEach((tag) => {
          const current = updatedMastery[tag] ?? {
            name: tag,
            mastery: 50,
            independentPasses: 0,
            hintPasses: 0,
            trend: '+5% this week',
          }

          const increment = isIndependent ? 12 : 4
          const newMastery = Math.min(100, current.mastery + increment)

          updatedMastery[tag] = {
            ...current,
            mastery: newMastery,
            independentPasses: current.independentPasses + (isIndependent ? 1 : 0),
            hintPasses: current.hintPasses + (isIndependent ? 0 : 1),
            trend: `+${increment}% recently`,
          }
        })

        // Check if Pattern Breaker achievement unlocked
        const newAchievements = { ...unlockedAchievements }
        let newNotif: NotificationItem | null = null

        if (!newAchievements['pattern-breaker']) {
          newAchievements['pattern-breaker'] = {
            id: 'pattern-breaker',
            title: 'PATTERN BREAKER',
            desc: 'Corrected a recurring mistake in independent practice.',
            date: 'Earned Today',
          }
          newNotif = {
            id: `notif-ach-${Date.now()}`,
            title: 'ACHIEVEMENT UNLOCKED: PATTERN BREAKER',
            message: 'You corrected a recurring mistake in independent practice.',
            type: 'achievement',
          }
        }

        set({
          completedChallenges: {
            ...completedChallenges,
            [challengeId]: newRecord,
          },
          conceptMastery: updatedMastery,
          unlockedAchievements: newAchievements,
          mistakeLogs: mistakeLogs.map((entry) =>
            entry.challengeId === challengeId && entry.resolved !== true
              ? { ...entry, resolved: true, status: 'resolved', resolvedAt: now, updatedAt: now }
              : entry,
          ),
          ...(newNotif ? { notification: newNotif } : {}),
        })
      },

      getCategoryStats: (category: string) => {
        const { mistakeLogs } = get()
        const matching = mistakeLogs.filter((m) => m.category === category)
        const distinctMap = new Map<string, string>()

        matching.forEach((m) => {
          distinctMap.set(m.challengeId, m.challengeTitle)
        })

        const distinctChallenges = Array.from(distinctMap.entries()).map(([id, title]) => ({ id, title }))

        return {
          occurrences: matching.length,
          distinctChallengesCount: distinctChallenges.length,
          challenges: distinctChallenges,
          isRecurring: distinctChallenges.length >= 2,
        }
      },

      getRecurringCategories: () => {
        const { mistakeLogs, getCategoryStats } = get()
        const categories = [...new Set(mistakeLogs.map((entry) => entry.category))]
        return categories.filter((category) => getCategoryStats(category).isRecurring)
      },

      getRecommendedChallenge: () => {
        const { getRecurringCategories, completedChallenges, conceptMastery, mistakeLogs } = get()
        const recurringCats = getRecurringCategories()

        // Priority 1: Challenge targeting a recurring mistake that is not yet completed
        if (recurringCats.length > 0) {
          const targetCat = recurringCats[0]
          const savedRecommendation = mistakeLogs.find(
            (entry) => entry.category === targetCat && entry.recommendedPractice,
          )?.recommendedPractice
          const recommendedByConcept = challengesData.find(
            (challenge) => challenge.id === savedRecommendation && !completedChallenges[challenge.id],
          )
          if (recommendedByConcept) {
            return {
              challenge: recommendedByConcept,
              reason: `You're practicing ${targetCat.replace(/_/g, ' ')}, a pattern encountered in different challenges.`,
            }
          }

          const matchingChallenge = challengesData.find(
            (c) =>
              c.mistakeCategories.some((category) => category === targetCat) &&
              !completedChallenges[c.id]
          )

          if (matchingChallenge) {
            return {
              challenge: matchingChallenge,
              reason: `You're practicing ${targetCat.replace(/_/g, ' ')}, a mistake pattern encountered in two different challenges.`,
            }
          }
        }

        // Priority 2: Challenge targeting lowest mastery concept
        const sortedConcepts = Object.values(conceptMastery).sort((a, b) => a.mastery - b.mastery)
        const lowestConcept = sortedConcepts[0]?.name ?? 'Boundaries'

        const matchingSkillChallenge = challengesData.find(
          (c) => c.conceptTags.includes(lowestConcept) && !completedChallenges[c.id]
        )

        if (matchingSkillChallenge) {
          return {
            challenge: matchingSkillChallenge,
            reason: `Targeting your lowest mastery concept (${lowestConcept} at ${sortedConcepts[0]?.mastery ?? 48}%).`,
          }
        }

        // Priority 3: Fallback first uncompleted challenge or default
        const uncompleted = challengesData.find((c) => !completedChallenges[c.id]) ?? challengesData[0]
        return {
          challenge: uncompleted,
          reason: 'Recommended for balanced debugging practice.',
        }
      },
    }),
    {
      name: 'debug-dojo-learning-loop',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persistedState: unknown) => {
        if (!persistedState || typeof persistedState !== 'object') return persistedState
        const state = persistedState as Partial<LearningLoopState>
        return {
          ...state,
          mistakeLogs: (state.mistakeLogs ?? []).filter((entry) => !entry.id.startsWith('init-')),
        }
      },
    }
  )
)
