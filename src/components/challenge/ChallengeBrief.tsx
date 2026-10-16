import { BookOpen, Code2, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react'
import type { Challenge } from '../../types/challenge'

function renderInlineCode(text: string) {
  const pattern = /`([^`]+)`/g
  const segments: Array<string | { text: string }> = []
  let lastIndex = 0

  text.replace(pattern, (match, code, index) => {
    if (lastIndex < index) {
      segments.push(text.slice(lastIndex, index))
    }
    segments.push({ text: code })
    lastIndex = index + match.length
    return match
  })

  if (lastIndex < text.length) {
    segments.push(text.slice(lastIndex))
  }

  return segments.map((segment, index) =>
    typeof segment === 'string' ? (
      <span key={`text-${index}`}>{segment}</span>
    ) : (
      <code key={`code-${index}`} className="inline-code">{segment.text}</code>
    ),
  )
}

export function ChallengeBrief({ challenge }: { challenge: Challenge }) {
  const descriptionSections = challenge.description.split('\n\n').filter(Boolean)
  const rulesMatch = challenge.description.match(/Rules:\n([\s\S]*?)(?:\n\n|$)/)
  const rules = rulesMatch
    ? rulesMatch[1]
        .split('\n')
        .map((rule) => rule.trim())
        .filter(Boolean)
        .map((rule) => rule.replace(/^•\s*/, ''))
    : []

  const constraints = [
    'Handle empty list inputs safely when applicable',
    'Support boundary inputs such as `k = 0` or `k > len(...)`',
    'Do not mutate the original input list',
    'Return the computed result instead of printing it',
  ]

  return (
    <div className="challenge-brief-panel">
      <div className="brief-section-title">
        <BookOpen size={14} className="text-gold" />
        <span>THE MISSION</span>
      </div>

      <div className="brief-function-sig">
        <Code2 size={14} className="text-blue" />
        <code>def {challenge.functionName}(...)</code>
      </div>

      <div className="brief-description">
        {descriptionSections
          .filter((section) => !section.startsWith('Rules:'))
          .map((para, idx) => (
            <p key={idx}>{renderInlineCode(para)}</p>
          ))}
      </div>

      {rules.length > 0 && (
        <div className="brief-subpanel">
          <div className="brief-subpanel__title">
            <AlertCircle size={13} className="text-gold" />
            <span>RULES</span>
          </div>
          <ul className="brief-rules-list">
            {rules.map((rule, idx) => (
              <li key={idx}>
                <span className="rule-bullet">•</span>
                <span>{renderInlineCode(rule)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="brief-subpanel">
        <div className="brief-subpanel__title">
          <CheckCircle2 size={13} className="text-gold" />
          <span>CONSTRAINTS</span>
        </div>
        <ul className="brief-constraints-list">
          {constraints.map((constraint, idx) => (
            <li key={idx}>
              <span className="constraint-check">✓</span>
              <span>{renderInlineCode(constraint)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="brief-subpanel">
        <div className="brief-subpanel__title">
          <Sparkles size={13} className="text-gold" />
          <span>EXAMPLES</span>
        </div>
        <div className="brief-examples-list">
          {challenge.visibleTests.map((t, idx) => (
            <div key={t.id} className="brief-example-card">
              <div className="brief-example-card__header">Example {idx + 1}</div>
              <div className="brief-example-card__body">
                <div className="example-line">
                  <span className="example-label">Input</span>
                  <code>{t.inputDesc}</code>
                </div>
                <div className="example-line">
                  <span className="example-label">Output</span>
                  <code>{t.expectedOutput}</code>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
