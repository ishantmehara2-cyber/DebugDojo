import type { ConfidenceLevel } from '../../types/challenge'

interface ConfidenceCheckProps {
  confidence: ConfidenceLevel | null
  onChange: (val: ConfidenceLevel) => void
}

const options: ConfidenceLevel[] = ['Not sure', 'Somewhat confident', 'Confident']

export function ConfidenceCheck({ confidence, onChange }: ConfidenceCheckProps) {
  return (
    <div className="confidence-panel">
      <span className="confidence-title">HOW CONFIDENT ARE YOU?</span>
      <div className="confidence-buttons">
        {options.map((opt) => {
          const isSelected = confidence === opt
          return (
            <button
              key={opt}
              type="button"
              className={`button button--sm ${isSelected ? 'button--primary' : 'button--ghost'}`}
              onClick={() => onChange(opt)}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}
