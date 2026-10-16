import { DojoAvatar } from './avatar/DojoAvatar'
import { SenseiDialogue } from './SenseiDialogue'
import {
  type SenseiState,
  defaultSenseiDialogues,
} from '../data/senseiDialogueData'

export interface SenseiStageProps {
  state?: SenseiState
  message?: string
  onContinue?: () => void
  onRequestHint?: () => void
  onDismissHint?: () => void
  hintPrompt?: boolean
  visible?: boolean
  className?: string
  dialoguePosition?: 'right' | 'top' | 'bottom' | 'inline'
  size?: 'sm' | 'md' | 'lg'
}

export function SenseiStage({
  state = 'idle',
  message,
  onContinue,
  onRequestHint,
  onDismissHint,
  hintPrompt,
  visible = true,
  className = '',
  dialoguePosition = 'right',
  size = 'md',
}: SenseiStageProps) {
  const activeMessage = message ?? defaultSenseiDialogues[state]
  const isDialogueVisible = Boolean(visible && activeMessage)

  const isTopPosition = dialoguePosition === 'top'

  return (
    <div className={`sensei-stage-container sensei-stage-container--${size} sensei-stage-container--${dialoguePosition} ${className}`}>
      {/* Dialogue renders above avatar when dialoguePosition === 'top' */}
      {isTopPosition && isDialogueVisible && activeMessage && (
        <SenseiDialogue
          message={activeMessage}
          state={state}
          visible={visible}
          onContinue={onContinue}
          onRequestHint={onRequestHint}
          onDismissHint={onDismissHint}
          hintPrompt={hintPrompt}
          position={dialoguePosition}
        />
      )}

      {/* Reusable Canonical Dojo Avatar */}
      <DojoAvatar state={state} size={size} />

      {/* Dialogue renders beside/below avatar for other positions */}
      {!isTopPosition && isDialogueVisible && activeMessage && (
        <SenseiDialogue
          message={activeMessage}
          state={state}
          visible={visible}
          onContinue={onContinue}
          onRequestHint={onRequestHint}
          onDismissHint={onDismissHint}
          hintPrompt={hintPrompt}
          position={dialoguePosition}
        />
      )}
    </div>
  )
}
