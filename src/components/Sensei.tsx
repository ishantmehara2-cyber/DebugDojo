import { DojoAvatar } from './avatar/DojoAvatar'
import { SenseiStage } from './SenseiStage'
import type { SenseiState } from '../data/senseiDialogueData'

export type { SenseiState }

export interface SenseiProps {
  state?: SenseiState
  message?: string
  onContinue?: () => void
  onRequestHint?: () => void
  onDismissHint?: () => void
  hintPrompt?: boolean
  compact?: boolean
  visible?: boolean
  className?: string
  dialoguePosition?: 'right' | 'top' | 'bottom' | 'inline'
  size?: 'sm' | 'md' | 'lg'
}

export default function Sensei({
  state = 'idle',
  message,
  onContinue,
  onRequestHint,
  onDismissHint,
  hintPrompt,
  compact = false,
  visible = true,
  className = '',
  dialoguePosition = 'right',
  size = 'md',
}: SenseiProps) {
  if (compact) {
    return <DojoAvatar state={state} size="sm" className={className} />
  }

  return (
    <SenseiStage
      state={state}
      message={message}
      onContinue={onContinue}
      onRequestHint={onRequestHint}
      onDismissHint={onDismissHint}
      hintPrompt={hintPrompt}
      visible={visible}
      className={className}
      dialoguePosition={dialoguePosition}
      size={size}
    />
  )
}
