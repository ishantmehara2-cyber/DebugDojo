import { AlertTriangle, ArrowRight, Compass, HelpCircle, Lightbulb, Code } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Explanation, MistakeCategory } from '../../types/challenge'
import { mistakeTaxonomyMap } from '../../data/mistakesTaxonomy'

interface FailureExplanationProps {
  explanation: Explanation
  mistakeCategory?: string | null
  onAskHint?: () => void
  onFocusEditor?: () => void
}

export function FailureExplanation({
  explanation,
  mistakeCategory,
  onAskHint,
  onFocusEditor,
}: FailureExplanationProps) {
  const category = mistakeCategory ?? 'boundary_comparison'

  return (
    <div className="failure-investigation-panel">
      <div className="investigation-header">
        <AlertTriangle size={16} className="text-rose" />
        <h2>WHY DID I FAIL?</h2>
      </div>

      <div className="investigation-grid">
        <div className="investigation-card">
          <div className="card-label">
            <span className="step-num">01</span>
            <span>WHAT HAPPENED</span>
          </div>
          <p>{explanation.whatHappened}</p>
        </div>

        <div className="investigation-card">
          <div className="card-label">
            <Compass size={13} className="text-gold" />
            <span className="step-num">02</span>
            <span>WHERE TO INVESTIGATE</span>
          </div>
          <p>{explanation.whereToInvestigate}</p>
        </div>

        <div className="investigation-card">
          <div className="card-label">
            <Lightbulb size={13} className="text-gold" />
            <span className="step-num">03</span>
            <span>WHY IT MATTERS</span>
          </div>
          <p>{explanation.whyItMatters}</p>
        </div>

        <div className="investigation-card investigation-card--prompt">
          <div className="card-label">
            <HelpCircle size={13} className="text-gold" />
            <span className="step-num">04</span>
            <span>THINK ABOUT THIS</span>
          </div>
          <p className="prompt-text">“{explanation.thinkAboutThis}”</p>
        </div>
      </div>

      <div className="investigation-action-bar">
        <div className="action-bar__left">
          {onAskHint && (
            <button
              type="button"
              className="button button--primary button--sm"
              onClick={onAskHint}
            >
              <span>ASK SENSEI FOR A HINT →</span>
            </button>
          )}

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

        {mistakeTaxonomyMap[category as MistakeCategory] && (
          <Link
            to={`/practice?category=${category}`}
            className="text-link"
          >
            <span>Practice {category.replace(/_/g, ' ')}</span>
            <ArrowRight size={13} />
          </Link>
        )}
      </div>
    </div>
  )
}
