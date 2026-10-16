import { Lightbulb, Lock, ChevronRight, Code } from 'lucide-react'

interface HintPanelProps {
  hints: [string, string, string]
  unlockedCount: number
  onUnlock: () => void
  onFocusEditor?: () => void
}

const hintTitles = [
  'HINT 1: CONCEPTUAL DIRECTION',
  'HINT 2: CODE FOCUS AREA',
  'HINT 3: REASONING CLUE',
]

export function HintPanel({ hints, unlockedCount, onUnlock, onFocusEditor }: HintPanelProps) {
  return (
    <div className="hint-panel">
      <div className="hint-panel-head">
        <div className="hint-panel-title">
          <Lightbulb size={15} className="text-gold" />
          <span>SENSEI'S HINTS</span>
        </div>
        <span className="badge badge--gold">
          {unlockedCount} / 3 UNLOCKED
        </span>
      </div>

      <div className="hint-cards-list">
        {hints.map((hintText, idx) => {
          const isUnlocked = idx < unlockedCount
          const isNext = idx === unlockedCount

          return (
            <div
              key={idx}
              className={`hint-card ${isUnlocked ? 'hint-card--unlocked' : 'hint-card--locked'}`}
            >
              <div className="hint-card-head">
                <span className="hint-title">{hintTitles[idx]}</span>
                {!isUnlocked && <Lock size={12} className="text-muted" />}
              </div>

              {isUnlocked ? (
                <p className="hint-body">{hintText}</p>
              ) : isNext ? (
                <div className="hint-next-action">
                  <p>A subtle clue is available to guide your thinking.</p>
                  <button
                    type="button"
                    className="button button--primary button--sm"
                    onClick={onUnlock}
                  >
                    <span>REVEAL HINT {idx + 1}</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              ) : (
                <p className="hint-body text-muted italic">Unlock previous hint first.</p>
              )}
            </div>
          )
        })}
      </div>

      {unlockedCount >= 3 && (
        <div className="hint-max-notice">
          <span>You have the strongest clue available. Now try the code yourself.</span>
          {onFocusEditor && (
            <button
              type="button"
              className="button button--secondary button--sm"
              onClick={onFocusEditor}
            >
              <Code size={13} />
              <span>BACK TO EDITOR</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
