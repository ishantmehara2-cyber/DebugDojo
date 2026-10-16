import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { type SenseiState, senseiStateLabels } from '../data/senseiDialogueData'

export interface SenseiDialogueProps {
  message: string
  visible?: boolean
  state?: SenseiState
  onContinue?: () => void
  onRequestHint?: () => void
  onDismissHint?: () => void
  hintPrompt?: boolean
  countdownSeconds?: number
  typingSpeed?: number
  autoStart?: boolean
  className?: string
  position?: 'right' | 'top' | 'bottom' | 'inline'
}

export function SenseiDialogue({
  message,
  visible = true,
  state = 'speaking',
  onContinue,
  onRequestHint,
  onDismissHint,
  hintPrompt = false,
  countdownSeconds = 4,
  typingSpeed = 28,
  autoStart = true,
  className = '',
  position = 'right',
}: SenseiDialogueProps) {
  // Respect prefers-reduced-motion
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const [displayedCount, setDisplayedCount] = useState(
    prefersReducedMotion || !autoStart || !visible ? message.length : 0
  )
  const [prevMessage, setPrevMessage] = useState(message)
  const [prevVisible, setPrevVisible] = useState(visible)
  const [countdown, setCountdown] = useState({ message, seconds: countdownSeconds })

  // Reset typewriter when message changes or visible becomes true
  if (message !== prevMessage || visible !== prevVisible) {
    setPrevMessage(message)
    setPrevVisible(visible)
    if (visible && autoStart && !prefersReducedMotion) {
      setDisplayedCount(0)
    } else {
      setDisplayedCount(message.length)
    }
  }

  // Typewriter effect interval
  useEffect(() => {
    if (prefersReducedMotion || !visible || displayedCount >= message.length) return

    const timer = setTimeout(() => {
      setDisplayedCount((prev) => Math.min(prev + 1, message.length))
    }, typingSpeed)

    return () => clearTimeout(timer)
  }, [visible, displayedCount, message.length, typingSpeed, prefersReducedMotion])

  const isComplete = displayedCount >= message.length
  const secondsRemaining = countdown.message === message ? countdown.seconds : countdownSeconds

  useEffect(() => {
    if (!visible || !hintPrompt || !isComplete || secondsRemaining <= 0) return
    const timer = window.setTimeout(() => {
      setCountdown((current) => ({
        message,
        seconds: Math.max(0, (current.message === message ? current.seconds : countdownSeconds) - 1),
      }))
      if (secondsRemaining <= 1) onDismissHint?.()
    }, 1000)
    return () => window.clearTimeout(timer)
  }, [visible, hintPrompt, isComplete, secondsRemaining, countdown.message, message, countdownSeconds, onDismissHint])

  const handleInteraction = useCallback(() => {
    if (!isComplete) {
      // Instant finish typing
      setDisplayedCount(message.length)
    } else if (onContinue) {
      onContinue()
    }
  }, [isComplete, message.length, onContinue])

  // Keyboard accessibility: Enter or Space
  useEffect(() => {
    if (!visible) return

    function handleKeyDown(event: KeyboardEvent) {
      if ((event.target as HTMLElement)?.closest('button, input, textarea, select')) return
      if (event.key === 'Enter' || event.key === ' ') {
        if (event.key === ' ') {
          event.preventDefault()
        }
        handleInteraction()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [visible, handleInteraction])

  const displayedText = message.slice(0, displayedCount)
  const label = senseiStateLabels[state] ?? 'Sensei'

  return (
    <AnimatePresence>
      {visible && (
        <div className={`sensei-dialogue-wrapper sensei-dialogue-wrapper--${position} ${className}`}>
          {/* Atmospheric Mist origin near face */}
          <motion.div
            className="speech-mist-origin"
            initial={{ opacity: 0, scale: 0.2, filter: 'blur(12px)' }}
            animate={{
              opacity: [0, 0.8, 0.4],
              scale: [0.3, 1.2, 1],
              filter: ['blur(12px)', 'blur(8px)', 'blur(10px)'],
            }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            aria-hidden="true"
          />

          {/* Soft connecting mist tail */}
          <motion.div
            className="speech-mist-tail"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 0.7, scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            aria-hidden="true"
          />

          {/* Atmospheric Speech Container */}
          <motion.div
            className={`speech-cloud speech-cloud--${state}`}
            initial={{ opacity: 0, scale: 0.9, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 4 }}
            transition={{
              duration: 0.4,
              delay: 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            onClick={(event) => {
              if ((event.target as HTMLElement).closest('button')) return
              handleInteraction()
            }}
            role="group"
            aria-label={`Sensei dialogue: ${message}`}
          >
            {/* Ambient gold glow */}
            <div className="speech-cloud__ambient-glow" aria-hidden="true" />

            {/* Cloud Header Tag */}
            <div className="speech-cloud__header">
              <span className="speech-cloud__state-dot" />
              <span className="speech-cloud__state-label">{label}</span>
            </div>

            {/* Dialogue Text */}
            <div className="speech-cloud__text">
              {displayedText}
              {!isComplete && <span className="speech-cloud__cursor" aria-hidden="true">|</span>}
            </div>

            {isComplete && hintPrompt && (
              <motion.div
                className="speech-cloud__hint-actions"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                {secondsRemaining > 0 && (
                  <div className="speech-cloud__hint-countdown" aria-live="off">
                    <span>Need a hint? {secondsRemaining}s</span>
                    <span className="speech-cloud__hint-track" aria-hidden="true">
                      <span style={{ transform: `scaleX(${secondsRemaining / countdownSeconds})` }} />
                    </span>
                  </div>
                )}
                <div className="speech-cloud__hint-buttons">
                  <button
                    type="button"
                    className="speech-cloud__hint-accept"
                    onClick={(event) => {
                      event.stopPropagation()
                      onRequestHint?.()
                    }}
                  >
                    YES, GIVE ME A HINT
                  </button>
                  <button
                    type="button"
                    className="speech-cloud__hint-dismiss"
                    onClick={(event) => {
                      event.stopPropagation()
                      onDismissHint?.()
                    }}
                  >
                    I'LL TRY MYSELF
                  </button>
                </div>
              </motion.div>
            )}

            {isComplete && !hintPrompt && onContinue && (
              <motion.div
                className="speech-cloud__continue"
                initial={{ opacity: 0, y: 2 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <button type="button" className="continue-btn-tag" onClick={onContinue}>
                  CONTINUE →
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
