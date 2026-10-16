import { History, Play, AlertTriangle, Lightbulb, CheckCircle2, X } from 'lucide-react'
import type { ReplayStep } from '../../types/challenge'

interface DebugReplayProps {
  timeline: ReplayStep[]
  isOpen: boolean
  onClose: () => void
}

export function DebugReplay({ timeline, isOpen, onClose }: DebugReplayProps) {
  if (!isOpen) return null

  return (
    <div className="modal-backdrop">
      <div className="modal-panel modal-panel--replay">
        <div className="modal-heading">
          <div className="replay-heading-title">
            <History size={18} className="text-gold" />
            <h2>DEBUG REPLAY</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close replay">
            <X size={18} />
          </button>
        </div>

        <p className="replay-subtitle">
          Reconstruct your problem-solving path from mistake to discovery.
        </p>

        {timeline.length === 0 ? (
          <div className="replay-empty">
            <p>No submission attempts recorded yet. Run tests to build your debug timeline.</p>
          </div>
        ) : (
          <div className="replay-timeline">
            {timeline.map((step) => {
              const icon =
                step.type === 'submit' ? (
                  <Play size={13} />
                ) : step.type === 'failure' || step.type === 'mistake' ? (
                  <AlertTriangle size={13} className="text-rose" />
                ) : step.type === 'hint' ? (
                  <Lightbulb size={13} className="text-gold" />
                ) : (
                  <CheckCircle2 size={13} className="text-green" />
                )

              return (
                <div key={step.id} className={`replay-step replay-step--${step.type}`}>
                  <div className="replay-step__marker">{icon}</div>
                  <div className="replay-step__content">
                    <div className="replay-step__head">
                      <span className="replay-step__title">{step.title}</span>
                      <time className="replay-step__time">{step.timestamp}</time>
                    </div>
                    <p className="replay-step__detail">{step.detail}</p>
                    {step.codeSnippet && (
                      <pre className="replay-step__code">
                        <code>{step.codeSnippet}</code>
                      </pre>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
