import { motion } from 'motion/react'
import { ArrowRight, Check, ShieldCheck, Sparkles, Trophy, Zap } from 'lucide-react'
import type { Challenge } from '../../types/challenge'
import { Badge } from '../ui'

interface ChallengeSuccessProps {
  challenge: Challenge
  unlockedHintsCount: number
  countdown: number | null
  nextChallengeTitle?: string
  isFinalChallenge: boolean
  onProceed: () => void
  onStay: () => void
}

export function ChallengeSuccess({
  challenge,
  unlockedHintsCount,
  countdown,
  nextChallengeTitle,
  isFinalChallenge,
  onProceed,
  onStay,
}: ChallengeSuccessProps) {
  const isIndependent = unlockedHintsCount === 0
  const progressOffset = countdown === null ? 0 : 138.23 * (1 - countdown / 4)

  return (
    <motion.section
      className="success-banner-panel"
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.36, ease: 'easeOut' }}
    >
      <div className="success-banner-panel__main">
        <div className="success-banner-panel__icon" aria-hidden="true">
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.08, ease: 'easeOut' }}
          >
            <Check size={25} strokeWidth={2.6} />
          </motion.span>
        </div>

        <Badge tone="green">
          <Trophy size={12} />
          <span>CASE SOLVED</span>
        </Badge>
        <h2 className="success-title">{challenge.title}</h2>
        <p className="success-subtitle">
          Excellent debugging work. You found the mistake.
        </p>

        <div className="success-stats-row">
          <div className="success-stat-pill">
            <Zap size={16} className="text-gold" />
            <div>
              <b>+{challenge.xpReward} XP</b>
              <small>Earned</small>
            </div>
          </div>
          <div className="success-stat-pill">
            <Sparkles size={16} className="text-green" />
            <div>
              <b>Concept Mastery</b>
              <small>{challenge.conceptTags.slice(0, 2).join(' + ')} practice</small>
            </div>
          </div>
          <Badge tone={isIndependent ? 'green' : 'blue'}>
            <ShieldCheck size={12} />
            <span>{isIndependent ? 'INDEPENDENT SOLVE' : 'HINT-ASSISTED SOLVE'}</span>
          </Badge>
        </div>
      </div>

      <div className="success-banner-panel__next">
        {isFinalChallenge ? (
          <div className="success-banner-panel__complete">
            <strong>All challenges completed</strong>
            <span>You’ve reached the end of the case catalog. Outstanding work.</span>
          </div>
        ) : (
          <div className="success-countdown" aria-live="polite">
            <div className="success-countdown__copy">
              <span className="success-countdown__eyebrow">NEXT CASE</span>
              <strong>{nextChallengeTitle}</strong>
              <span>
                Next challenge in {countdown ?? 4} {countdown === 1 ? 'second' : 'seconds'}
              </span>
            </div>
            <div
              className="success-countdown__dial"
              role="img"
              aria-label={`Next challenge in ${countdown ?? 4} seconds`}
            >
              <svg viewBox="0 0 52 52" aria-hidden="true">
                <circle className="success-countdown__track" cx="26" cy="26" r="22" />
                <circle
                  className="success-countdown__progress"
                  cx="26"
                  cy="26"
                  r="22"
                  style={{ strokeDashoffset: progressOffset }}
                />
              </svg>
              <span>{countdown ?? 4}</span>
            </div>
          </div>
        )}

        <div className="success-actions-row">
          <button
            type="button"
            className="button button--primary button--md success-proceed-button"
            onClick={onProceed}
          >
            <span>{isFinalChallenge ? 'VIEW ALL CHALLENGES' : 'PROCEED TO NEXT CHALLENGE'}</span>
            <ArrowRight size={15} />
          </button>
          <button
            type="button"
            className="button button--secondary button--md success-stay-button"
            onClick={onStay}
          >
            Stay Here
          </button>
        </div>
      </div>
    </motion.section>
  )
}
