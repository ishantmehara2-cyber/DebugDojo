import { Terminal, ShieldCheck, Check, X } from 'lucide-react'
import type { TestResultItem } from '../../types/challenge'

interface TestArenaProps {
  visibleResults: TestResultItem[]
  hiddenPassedCount: number
  hiddenEvaluatedCount: number
  totalHiddenCount: number
  hasRun: boolean
}

export function TestArena({
  visibleResults,
  hiddenPassedCount,
  hiddenEvaluatedCount,
  totalHiddenCount,
  hasRun,
}: TestArenaProps) {
  const visiblePassed = visibleResults.filter((r) => r.status === 'PASS').length

  return (
    <div className="test-arena-panel">
      <div className="test-arena-header">
        <div>
          <div className="test-arena-title">
            <Terminal size={15} className="text-gold" />
            <span>TEST ARENA</span>
          </div>
          <p className="test-arena-subtext">“See what your code tells us.”</p>
        </div>

        {hasRun && (
          <div className="test-arena-summary">
            <span className={`summary-pill ${visiblePassed === visibleResults.length ? 'text-green' : 'text-rose'}`}>
              {visiblePassed} / {visibleResults.length} VISIBLE TESTS PASSED
            </span>
            <span className="divider">•</span>
            <span className="summary-pill text-gold">
              {hiddenEvaluatedCount} / {totalHiddenCount} HIDDEN TESTS EVALUATED
            </span>
          </div>
        )}
      </div>

      {/* Visible Test Cases List */}
      <div className="test-rows-list">
        <div className="test-section-label">VISIBLE TESTS</div>
        {visibleResults.map((result, idx) => {
          const isPass = result.status === 'PASS'
          const labelText =
            result.status === 'PASS'
              ? 'PASSED'
              : result.status === 'WRONG OUTPUT'
              ? 'WRONG OUTPUT'
              : result.status === 'RUNTIME ERROR'
              ? 'RUNTIME ERROR'
              : result.status === 'RESOURCE LIMIT'
              ? 'RESOURCE LIMIT'
              : 'TIMEOUT'

          const errorExplanation =
            result.status === 'WRONG OUTPUT'
              ? 'Your function returned a result that does not match the expected behavior for this test.'
              : result.status === 'RUNTIME ERROR'
              ? 'Your program stopped before producing a valid return value.'
              : result.status === 'TIMEOUT'
              ? 'Your program did not finish within the allowed time. Look for a loop or operation that may not terminate.'
              : result.status === 'RESOURCE LIMIT'
              ? 'The isolated evaluator stopped this run because it exceeded a safety limit.'
              : null

          return (
            <div
              key={result.id}
              className={`test-result-row ${isPass ? 'test-result-row--pass' : hasRun ? 'test-result-row--fail' : ''}`}
            >
              <div className="test-result-row__left">
                <span className="test-idx">{isPass ? '✓' : '✕'} Test {idx + 1}</span>
                <div className="test-input-wrapper">
                  <small className="field-lbl">Input:</small>
                  <code>{result.inputDesc}</code>
                </div>
              </div>

              <div className="test-result-row__right">
                <div className="test-expected">
                  <small className="field-lbl">Expected:</small>
                  <code>{result.expectedOutput}</code>
                </div>

                {hasRun && (
                  <div className="test-actual">
                    <small className="field-lbl">Your output:</small>
                    <code className={isPass ? 'text-green' : 'text-rose'}>
                      {result.actualOutput}
                    </code>
                  </div>
                )}

                <div className="test-status">
                  {hasRun ? (
                    <span className={`status-tag status-tag--${isPass ? 'pass' : 'fail'}`}>
                      {isPass ? <Check size={12} /> : <X size={12} />}
                      {labelText}
                    </span>
                  ) : (
                    <span className="status-tag status-tag--pending">NOT RUN</span>
                  )}
                </div>
              </div>

              {!isPass && hasRun && errorExplanation && (
                <div className="test-result-row__explanation">
                  <span>{errorExplanation}</span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Protected Hidden Test Summary Row */}
      <div className="hidden-tests-row">
        <div className="hidden-tests-info">
          <ShieldCheck size={16} className="text-gold" />
          <div>
            <b>HIDDEN TESTS</b>
            <p>
              {hasRun
                ? `${hiddenEvaluatedCount} / ${totalHiddenCount} evaluated • Edge cases included`
                : `${totalHiddenCount} protected edge cases`}
            </p>
          </div>
        </div>
        <div className="hidden-tests-status">
          {!hasRun || hiddenEvaluatedCount === 0 ? (
            <span className="badge badge--muted">
              {hasRun ? 'NOT EVALUATED' : 'PROTECTED'}
            </span>
          ) : (
            <span className={`badge ${hiddenPassedCount === totalHiddenCount ? 'badge--green' : 'badge--rose'}`}>
              {hiddenPassedCount} / {hiddenEvaluatedCount} EVALUATED PASSED
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
