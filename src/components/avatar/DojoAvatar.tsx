import { motion } from 'motion/react'
import { avatarOptions, type AvatarGender } from '../../config/avatarConfig'
import type { SenseiState } from '../../data/senseiDialogueData'
import { useLearnerStore } from '../../store/useLearnerStore'

export interface DojoAvatarProps {
  avatar?: AvatarGender
  state?: SenseiState
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showGlow?: boolean
  animated?: boolean
}

// State-driven animation variants for the avatar mascot
const stateAnimations: Record<
  SenseiState,
  {
    animate: Record<string, number | number[] | string>
    transition: Record<string, number | string | boolean | number[]>
  }
> = {
  idle: {
    animate: { y: [0, -4, 0], scale: 1, rotate: 0 },
    transition: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
  },
  thinking: {
    animate: { y: [0, -2, 0], scale: [1, 1.03, 1], rotate: [0, 1, -1, 0] },
    transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
  },
  speaking: {
    animate: { y: [0, -3, 0], rotate: [0, -1.5, 1.5, 0], scale: [1, 1.02, 1] },
    transition: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
  },
  success: {
    animate: { y: [0, -8, 0], scale: [1, 1.06, 1], rotate: [0, -2, 2, 0] },
    transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' },
  },
  warning: {
    animate: { y: [0, -2, 0], rotate: [0, -2, 2, 0] },
    transition: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
  },
  recurring: {
    animate: { y: [0, -3, 0], scale: [1, 1.02, 1] },
    transition: { duration: 3.0, repeat: Infinity, ease: 'easeInOut' },
  },
  hint: {
    animate: { y: [0, -4, 0], rotate: [0, 2.5, 0] },
    transition: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
  },
  mastery: {
    animate: { y: [0, -5, 0], scale: [1, 1.04, 1], rotate: [0, 1, -1, 0] },
    transition: { duration: 4.0, repeat: Infinity, ease: 'easeInOut' },
  },
  observing: {
    animate: { y: [0, -2, 0], scale: [1, 1.01, 1] },
    transition: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
  },
  encouraging: {
    animate: { y: [0, -3, 0], scale: [1, 1.03, 1] },
    transition: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
  },
  explaining: {
    animate: { y: [0, -4, 0], rotate: [0, -1, 1, 0], scale: [1, 1.02, 1] },
    transition: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
  },
  notice: {
    animate: { y: [0, -2, 0], rotate: [0, -1, 0] },
    transition: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' },
  },
  error_detected: {
    animate: { y: [0, -3, 0], scale: [1, 1.025, 1] },
    transition: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' },
  },
  happy: {
    animate: { y: [0, -6, 0], scale: [1, 1.04, 1] },
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },
  hint_1: {
    animate: { y: [0, -3, 0], rotate: [0, 1, 0] },
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
  hint_2: {
    animate: { y: [0, -3, 0], rotate: [0, -1, 0] },
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
  hint_3: {
    animate: { y: [0, -3, 0], scale: [1, 1.02, 1] },
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
  timeout: {
    animate: { y: [0, -2, 0], rotate: [0, -1, 0] },
    transition: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
  },
  runtime_error: {
    animate: { y: [0, -2, 0], rotate: [0, 1, 0] },
    transition: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
  },
}

export function DojoAvatar({
  avatar,
  state = 'idle',
  size = 'md',
  className = '',
  showGlow = true,
  animated = true,
}: DojoAvatarProps) {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const storeAvatar = useLearnerStore((s) => s.avatarPreference)
  const activeGender: AvatarGender = avatar ?? storeAvatar ?? 'female'
  const option = avatarOptions[activeGender] ?? avatarOptions.female

  const animConfig = stateAnimations[state] ?? stateAnimations.idle

  return (
    <div className={`tutor-avatar-container tutor-avatar-container--${size} ${className}`}>
      {/* Subtle Ambient Radial Glow */}
      {showGlow && (
        <div className={`tutor-avatar-glow tutor-avatar-glow--${state}`} aria-hidden="true" />
      )}

      {/* Responsive Bounded Mascot Figure */}
      <motion.div
        className="tutor-avatar-figure"
        animate={animated && !prefersReducedMotion ? animConfig.animate : { y: 0, scale: 1, rotate: 0 }}
        transition={animated && !prefersReducedMotion ? animConfig.transition : { duration: 0 }}
      >
        <img
          src={option.image}
          alt={`Debug Dojo ${option.title}`}
          className="tutor-avatar"
        />
      </motion.div>
    </div>
  )
}
