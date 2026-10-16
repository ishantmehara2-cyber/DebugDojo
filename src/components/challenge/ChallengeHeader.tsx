import { ArrowLeft, Target, RefreshCw, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Challenge } from '../../types/challenge'
import { Badge } from '../ui'

interface ChallengeHeaderProps {
  challenge: Challenge
  attemptCount: number
  isSolved: boolean
}

export function ChallengeHeader({ challenge, attemptCount, isSolved }: ChallengeHeaderProps) {
  const badgeTone = challenge.difficulty === 'Easy' ? 'green' : challenge.difficulty === 'Medium' ? 'gold' : 'rose'

  return (
    <div className="workstation-header">
      <div className="workstation-header__nav">
        <Link to="/challenges" className="text-link">
          <ArrowLeft size={14} /> Case Files
        </Link>
        <div className="workstation-status-pill">
          {isSolved ? (
            <span className="badge badge--green">
              <CheckCircle2 size={12} /> Solved
            </span>
          ) : (
            <span className="badge badge--muted">
              <RefreshCw size={11} /> Attempt {attemptCount + 1} • Unsolved
            </span>
          )}
        </div>
      </div>

      <div className="workstation-header__main">
        <div>
          <div className="workstation-header__title-row">
            <h1 className="workstation-title">{challenge.title}</h1>
            <Badge tone={badgeTone}>{challenge.difficulty.toUpperCase()}</Badge>
          </div>
          <p className="workstation-subtitle">
            <Target size={14} className="text-gold" />
            <span>{challenge.learningObjective}</span>
          </p>
        </div>

        <div className="workstation-header__tags">
          {challenge.conceptTags.map((tag) => (
            <span key={tag} className="concept-tag">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
