import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) {
  return <button className={`button button--${variant} button--${size} ${className}`} {...props} />
}

export function Card({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLElement> & { children: ReactNode }) {
  return (
    <section className={`card ${className}`} {...props}>
      {children}
    </section>
  )
}

export function Badge({
  children,
  tone = 'gold',
  className = '',
}: {
  children: ReactNode
  tone?: 'gold' | 'blue' | 'green' | 'muted' | 'rose'
  className?: string
}) {
  return <span className={`badge badge--${tone} ${className}`}>{children}</span>
}

export function ProgressBar({
  value,
  color = 'gold',
  label,
  className = '',
}: {
  value: number
  color?: string
  label?: string
  className?: string
}) {
  const safeValue = Math.min(100, Math.max(0, value))
  return (
    <div
      className={`progress ${className}`}
      role="progressbar"
      aria-label={label ?? 'Progress'}
      aria-valuenow={safeValue}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.span
        className={`progress__fill progress__fill--${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${safeValue}%` }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      />
    </div>
  )
}

export function Avatar({
  name,
  size = 'md',
}: {
  name: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const initial = name ? name.charAt(0).toUpperCase() : 'D'
  return (
    <span className={`avatar avatar--${size}`} aria-label={`${name} profile`}>
      <span className="avatar-initial">{initial}</span>
    </span>
  )
}

export function PageContainer({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <main className={`page-container ${className}`}>{children}</main>
}

export function SectionHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string
  title: string
  action?: ReactNode
}) {
  return (
    <div className="section-header">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="section-title">{title}</h2>
      </div>
      {action}
    </div>
  )
}

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      className="page-transition"
      initial={{ opacity: 0, y: 9 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.24, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}) {
  useEffect(() => {
    if (!open) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose()
          }}
        >
          <motion.div
            className="modal-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
          >
            <div className="modal-heading">
              <h2 id="modal-title">{title}</h2>
              <button className="icon-button" type="button" aria-label="Close dialog" onClick={onClose}>
                <X size={18} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
