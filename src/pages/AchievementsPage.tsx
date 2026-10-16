import { Award, CheckCircle2, ShieldCheck, Target, Flame, RefreshCw, X } from 'lucide-react'
import { PageTransition, PageContainer, Badge } from '../components/ui'
import { useLearningLoopStore } from '../store/useLearningLoopStore'

const allAchievementsList = [
  {
    id: 'first-debug',
    title: 'FIRST DEBUG',
    desc: 'Solved your first challenge in the arena.',
    defaultDate: 'Earned Oct 10',
    icon: CheckCircle2,
  },
  {
    id: 'edge-detective',
    title: 'EDGE CASE DETECTIVE',
    desc: 'Correctly handled a boundary condition.',
    defaultDate: 'Earned Oct 12',
    icon: Target,
  },
  {
    id: 'independent-thinker',
    title: 'INDEPENDENT THINKER',
    desc: 'Solved 3 challenges without hints.',
    defaultDate: 'Earned Oct 15',
    icon: ShieldCheck,
  },
  {
    id: 'pattern-breaker',
    title: 'PATTERN BREAKER',
    desc: 'Corrected a recurring mistake in independent practice.',
    defaultDate: 'Earned Today',
    icon: RefreshCw,
  },
  {
    id: 'week-discipline',
    title: 'WEEK OF DISCIPLINE',
    desc: 'Trained 7 days in a row on the dojo floor.',
    defaultDate: 'Earned Today',
    icon: Flame,
  },
]

export default function AchievementsPage() {
  const { unlockedAchievements, notification, dismissNotification } = useLearningLoopStore()

  return (
    <PageTransition>
      <PageContainer className="achievements-page">
        <header className="page-header">
          <p className="eyebrow">
            <Award size={13} /> ACHIEVEMENTS / MILESTONES
          </p>
          <h1>Earned <span>Milestones.</span></h1>
          <p className="page-subtitle">
            A record of persistence, curiosity, and independent thinking.
          </p>
        </header>

        {/* Unlocked Notification Toast Banner */}
        {notification && (
          <div className="notification-banner">
            <div>
              <b className="notification-title">{notification.title}</b>
              <p className="notification-desc">{notification.message}</p>
            </div>
            <button
              type="button"
              className="icon-button"
              onClick={dismissNotification}
              aria-label="Dismiss notification"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="achievements-list">
          {allAchievementsList.map((item) => {
            const Icon = item.icon
            const isUnlocked = Boolean(unlockedAchievements[item.id] || item.id === 'week-discipline')
            const dateText = unlockedAchievements[item.id]?.date ?? item.defaultDate

            return (
              <div
                key={item.id}
                className={`achievement-row ${isUnlocked ? 'achievement-row--unlocked' : 'achievement-row--locked'}`}
              >
                <div className="achievement-row__left">
                  <span className="achievement-row__icon">
                    <Icon size={18} className={isUnlocked ? 'text-gold' : 'text-muted'} />
                  </span>
                  <div>
                    <div className="achievement-row__head">
                      <b className="achievement-row__title">{item.title}</b>
                      {isUnlocked ? (
                        <Badge tone="gold">UNLOCKED</Badge>
                      ) : (
                        <Badge tone="muted">LOCKED</Badge>
                      )}
                    </div>
                    <p className="achievement-row__desc">{item.desc}</p>
                  </div>
                </div>

                <span className="achievement-row__date">{isUnlocked ? dateText : 'Locked'}</span>
              </div>
            )
          })}
        </div>
      </PageContainer>
    </PageTransition>
  )
}
