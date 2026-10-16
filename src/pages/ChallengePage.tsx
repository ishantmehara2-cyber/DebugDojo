import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { History } from 'lucide-react'
import Sensei from '../components/Sensei'
import { PageTransition, PageContainer } from '../components/ui'
import { ChallengeHeader } from '../components/challenge/ChallengeHeader'
import { ChallengeBrief } from '../components/challenge/ChallengeBrief'
import { PythonEditor } from '../components/challenge/PythonEditor'
import { TestArena } from '../components/challenge/TestArena'
import { FailureExplanation } from '../components/challenge/FailureExplanation'
import { HintPanel } from '../components/challenge/HintPanel'
import { BeforeSubmitChecklist } from '../components/challenge/BeforeSubmitChecklist'
import { ConfidenceCheck } from '../components/challenge/ConfidenceCheck'
import { ChallengeSuccess } from '../components/challenge/ChallengeSuccess'
import { DebugReplay } from '../components/challenge/DebugReplay'
import { MistakePatternCard } from '../components/challenge/MistakePatternCard'
import { useChallengeStore } from '../store/useChallengeStore'
import { challengesData } from '../data/challengesData'
import type { SenseiState } from '../data/senseiDialogueData'
import { getCoachHints } from '../services/mistakeCoach'

export default function ChallengePage() {
  const { challengeId } = useParams<{ challengeId: string }>()
  const navigate = useNavigate()
  const [successCountdown, setSuccessCountdown] = useState<number | null>(null)
  const [successDismissed, setSuccessDismissed] = useState(false)
  const navigationStarted = useRef(false)
  const transitionActionTaken = useRef(false)

  const {
    currentChallenge,
    code,
    attemptCount,
    visibleResults,
    hiddenPassedCount,
    hiddenEvaluatedCount,
    totalHiddenCount,
    allPassed,
    isFailed,
    hasRun,
    unlockedHintsCount,
    confidence,
    checklist,
    explanationVisible,
    isDebugReplayOpen,
    replayTimeline,
    detectedMistakeCategory,
    coachAnalysis,
    coachState,
    coachMessage,
    coachHints,
    hintPromptVisible,
    isRunning,
    executionError,
    selectChallenge,
    setCode,
    runTests,
    unlockHint,
    dismissHintPrompt,
    toggleChecklist,
    setConfidence,
    resetCode,
    toggleDebugReplay,
  } = useChallengeStore()

  useEffect(() => {
    if (challengeId && challengeId !== currentChallenge.id) {
      selectChallenge(challengeId)
    }
  }, [challengeId, currentChallenge.id, selectChallenge])

  const currentIndex = challengesData.findIndex((challenge) => challenge.id === currentChallenge.id)
  const nextChallenge = currentIndex >= 0 ? challengesData[currentIndex + 1] : undefined
  const isFinalChallenge = !nextChallenge
  const isSuccessTransitionVisible = allPassed
    && hasRun
    && !isRunning
    && challengeId === currentChallenge.id
    && !successDismissed

  useEffect(() => {
    if (!isSuccessTransitionVisible || successCountdown === null || transitionActionTaken.current) return
    const timer = window.setTimeout(() => {
      if (successCountdown > 1) {
        setSuccessCountdown(successCountdown - 1)
        return
      }
      if (navigationStarted.current) return
      navigationStarted.current = true
      transitionActionTaken.current = true
      setSuccessCountdown(null)
      if (nextChallenge) navigate(`/challenge/${nextChallenge.id}`)
    }, 1000)
    return () => window.clearTimeout(timer)
  }, [isSuccessTransitionVisible, navigate, nextChallenge, successCountdown])

  const senseiState: SenseiState = coachState
  const senseiMessage = coachMessage
    ?? `Take your time with ${currentChallenge.title}. Read the contract before touching the code.`
  const displayedHints = coachHints ?? getCoachHints(
    currentChallenge.mistakeCategories[0] ?? 'wrong_output',
    [
      '🤔 Trace one small example by hand.',
      'Compare each step with the behavior the task describes.',
      'Check the first point where your reasoning and the task requirements differ.',
    ],
  )

  const handleProceed = () => {
    if (transitionActionTaken.current || navigationStarted.current) return
    transitionActionTaken.current = true
    navigationStarted.current = true
    setSuccessCountdown(null)
    setSuccessDismissed(true)
    navigate(nextChallenge ? `/challenge/${nextChallenge.id}` : '/challenges')
  }

  const handleStay = () => {
    if (transitionActionTaken.current || navigationStarted.current) return
    transitionActionTaken.current = true
    setSuccessCountdown(null)
    setSuccessDismissed(true)
  }

  const handleRunTests = async () => {
    const previousAttemptCount = useChallengeStore.getState().attemptCount
    await runTests()
    const latest = useChallengeStore.getState()
    if (
      latest.attemptCount > previousAttemptCount
      && latest.allPassed
      && latest.currentChallenge.id === challengeId
    ) {
      setSuccessDismissed(false)
      setSuccessCountdown(nextChallenge ? 4 : null)
      navigationStarted.current = false
      transitionActionTaken.current = false
    }
  }

  const handleFocusEditor = () => {
    const el = document.getElementById('monaco-editor-section')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const handleAskHint = () => {
    if (unlockedHintsCount < 3) {
      unlockHint()
    }
  }

  return (
    <PageTransition>
      <PageContainer className="workstation-container">
        {/* Top Header Bar */}
        <div className="workstation-topbar">
          <ChallengeHeader
            challenge={currentChallenge}
            attemptCount={attemptCount}
            isSolved={allPassed}
          />

          <button
            type="button"
            className="button button--ghost button--sm replay-trigger-btn"
            onClick={toggleDebugReplay}
          >
            <History size={14} />
            <span>Debug Replay</span>
            {replayTimeline.length > 0 && (
              <span className="replay-badge">{replayTimeline.length}</span>
            )}
          </button>
        </div>

        {/* Unified 3-Zone Workstation Grid Layout */}
        <div className="workstation-grid">
          {/* PANEL LEFT: Challenge Briefing */}
          <div className="workstation-panel workstation-panel--left">
            <ChallengeBrief challenge={currentChallenge} />
          </div>

          {/* PANEL CENTER: Monaco Code Editor */}
          <div className="workstation-panel workstation-panel--center">
            <PythonEditor
              code={code}
              onChange={setCode}
              onRun={handleRunTests}
              onReset={resetCode}
              isRunning={isRunning}
            />
          </div>

          {/* PANEL RIGHT: Sensei Coach */}
          <div className="workstation-panel workstation-panel--right">
            <div className="sensei-workstation-wrapper">
              <Sensei
                state={senseiState}
                message={senseiMessage}
                hintPrompt={hintPromptVisible && isFailed && unlockedHintsCount < 3}
                onRequestHint={handleAskHint}
                onDismissHint={dismissHintPrompt}
                dialoguePosition="top"
                size="md"
              />
            </div>
            {executionError && (
              <p className="runner-error" role="alert">
                {executionError}
              </p>
            )}
          </div>
        </div>

        {/* Success Banner Overlay when all tests pass */}
        {isSuccessTransitionVisible && (
          <div className="workstation-success-section">
            <ChallengeSuccess
              challenge={currentChallenge}
              unlockedHintsCount={unlockedHintsCount}
              countdown={successCountdown}
              nextChallengeTitle={nextChallenge?.title}
              isFinalChallenge={isFinalChallenge}
              onProceed={handleProceed}
              onStay={handleStay}
            />
          </div>
        )}

        {/* BOTTOM SECTION: Test Arena & Investigation */}
        <div className="workstation-bottom-section">
          <TestArena
            visibleResults={visibleResults}
            hiddenPassedCount={hiddenPassedCount}
            hiddenEvaluatedCount={hiddenEvaluatedCount}
            totalHiddenCount={totalHiddenCount}
            hasRun={hasRun}
          />

          {/* Failure Investigation & Coaching Controls */}
          {explanationVisible && isFailed && (
            <div className="workstation-investigation-section">
              <FailureExplanation
                explanation={coachAnalysis
                  ? {
                      whatHappened: coachAnalysis.explanation,
                      whereToInvestigate: 'Start with the line or operation you changed most recently.',
                      whyItMatters: coachAnalysis.whyItMatters,
                      thinkAboutThis: 'Which assumption does this code make about the values it receives?',
                    }
                  : currentChallenge.explanation}
                mistakeCategory={detectedMistakeCategory}
                onAskHint={handleAskHint}
                onFocusEditor={handleFocusEditor}
              />

              {detectedMistakeCategory && (
                <MistakePatternCard category={detectedMistakeCategory} />
              )}
            </div>
          )}

          {/* Hints, Checklist, Confidence */}
          <div className="workstation-coaching-grid" id="hint-section-panel">
            <HintPanel
              hints={displayedHints}
              unlockedCount={unlockedHintsCount}
              onUnlock={unlockHint}
              onFocusEditor={handleFocusEditor}
            />

            <div className="coaching-subgrid">
              <BeforeSubmitChecklist
                checklist={checklist}
                onToggle={toggleChecklist}
              />

              <ConfidenceCheck
                confidence={confidence}
                onChange={setConfidence}
              />
            </div>
          </div>
        </div>

        {/* Debug Replay Timeline Modal */}
        <DebugReplay
          timeline={replayTimeline}
          isOpen={isDebugReplayOpen}
          onClose={toggleDebugReplay}
        />
      </PageContainer>
    </PageTransition>
  )
}
