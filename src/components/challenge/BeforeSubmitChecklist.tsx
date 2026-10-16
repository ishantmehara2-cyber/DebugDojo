import { CheckSquare, Square } from 'lucide-react'
import type { ChecklistState } from '../../store/useChallengeStore'

interface BeforeSubmitChecklistProps {
  checklist: ChecklistState
  onToggle: (key: keyof ChecklistState) => void
}

const items: Array<{ key: keyof ChecklistState; label: string }> = [
  { key: 'empty', label: 'Did I consider an empty input?' },
  { key: 'smallest', label: 'Did I test the smallest valid case?' },
  { key: 'boundary', label: 'Did I test the largest / boundary case?' },
  { key: 'returning', label: 'Am I returning the value (not printing)?' },
  { key: 'unmutated', label: 'Did I avoid modifying the input?' },
]

export function BeforeSubmitChecklist({
  checklist,
  onToggle,
}: BeforeSubmitChecklistProps) {
  const completedCount = Object.values(checklist).filter(Boolean).length

  return (
    <div className="checklist-panel">
      <div className="checklist-head">
        <span className="checklist-title">BEFORE YOU SUBMIT</span>
        <span className="checklist-count">{completedCount} / 5 CHECKED</span>
      </div>

      <div className="checklist-items">
        {items.map(({ key, label }) => {
          const isChecked = checklist[key]
          return (
            <button
              key={key}
              type="button"
              className={`checklist-row ${isChecked ? 'checklist-row--checked' : ''}`}
              onClick={() => onToggle(key)}
            >
              {isChecked ? (
                <CheckSquare size={15} className="text-green" />
              ) : (
                <Square size={15} className="text-muted" />
              )}
              <span>{label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
