import { ArrowRight, BookOpen, Flame, Zap, ShieldAlert, ShieldCheck, History } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageTransition, PageContainer, Badge } from '../components/ui'
import { learnerProfile } from '../data/mockData'
import { useLearnerStore } from '../store/useLearnerStore'
import { useLearningLoopStore } from '../store/useLearningLoopStore'
import { mistakeTaxonomyMap } from '../data/mistakesTaxonomy'
import type { MistakeCategory } from '../types/challenge'

export default function DashboardPage() {
  const name = useLearnerStore((state) => state.name) ?? learnerProfile.name
  const { getRecommendedChallenge, getRecurringCategories, getCategoryStats, mistakeLogs } = useLearningLoopStore()

  const { challenge: recChallenge, reason: recReason } = getRecommendedChallenge()
  const recurringCats = getRecurringCategories()
  const primaryRecurringCat = recurringCats[0] ?? 'unhandled_short_input'
  const catStats = getCategoryStats(primaryRecurringCat)
  const catInfo = mistakeTaxonomyMap[primaryRecurringCat as MistakeCategory] ?? {
    label: primaryRecurringCat.replace(/_/g, ' ').toUpperCase(),
    shortTitle: primaryRecurringCat.replace(/_/g, ' '),
    plainExplanation: 'A coding pattern has appeared in more than one challenge.',
  }
  const hasPracticeCategory = Boolean(mistakeTaxonomyMap[primaryRecurringCat as MistakeCategory])
  const greetingLabel = 'GOOD EVENING'

  return (
    <PageTransition>
      <PageContainer className="hq-page">
        {/* Dashboard Header */}
        <header className="page-header hq-header">
          <div>
            <p className="eyebrow">DOJO / INVESTIGATION BOARD</p>
            <h1>
              {greetingLabel}, <span>{name}</span>
            </h1>
            <p className="page-subtitle">Continue your current investigation.</p>
          </div>
          <div className="rank-chip">
            <span className="rank-chip__icon">道</span>
            <div>
              <small>CURRENT RANK</small>
              <b>{learnerProfile.rank.toUpperCase()}</b>
            </div>
          </div>
        </header>

        {/* Clean Coach Status Notification (No Avatar Image) */}
        <section className="dashboard-mentor">
          <div className="dashboard-mentor__left">
            <div className="dashboard-mentor__label">
              <span className="status-dot" /> YOUR CODING COACH
            </div>
            <p className="dashboard-mentor__msg">
              {catStats.isRecurring
                ? `Welcome back, ${name}. This pattern is familiar let’s investigate it directly.`
                : `Welcome back, ${name}. Ready to investigate your next bug ?`}
            </p>
          </div>
        </section>

        {catStats.isRecurring && (
          <section className="hq-section">
            <div className="dashboard-section-label">CURRENT FOCUS</div>
            <div className="mistake-banner">
              <div className="mistake-info">
                <ShieldAlert size={18} className="text-rose" />
                <div>
                  <b>{catInfo.label} ({catStats.distinctChallengesCount} ENCOUNTERS)</b>
                  <p>“You're making the same assumption across different problems: {catInfo.plainExplanation}”</p>
                </div>
              </div>
              <Link
                to={hasPracticeCategory
                  ? `/practice?category=${primaryRecurringCat}`
                  : `/challenge/${recChallenge.id}`}
                className="button button--secondary button--sm"
              >
                <span>{hasPracticeCategory ? 'PRACTICE THIS MISTAKE →' : 'CONTINUE PRACTICE →'}</span>
              </Link>
            </div>
          </section>
        )}

        <section className="hq-section hq-section--mission">
          <div className="hq-section-head">
            <span className="dashboard-section-label">
              <span className="status-dot" /> RECOMMENDED NEXT
            </span>
            <Badge tone="gold">NEXT INVESTIGATION</Badge>
          </div>

          <div className="mission-box">
            <div className="mission-box__info">
              <h2 className="mission-title">{recChallenge.title}</h2>
              <p className="mission-reason">
                <strong>Why this challenge?</strong> “{recReason}”
              </p>
              <div className="mission-meta">
                <Badge tone={recChallenge.difficulty === 'Easy' ? 'green' : 'gold'}>
                  {recChallenge.difficulty.toUpperCase()}
                </Badge>
                <span className="meta-concepts">Concepts: {recChallenge.conceptTags.join(' • ')}</span>
                <span className="meta-time">{recChallenge.duration}</span>
              </div>
            </div>

            <Link
              to={`/challenge/${recChallenge.id}`}
              className="button button--primary button--lg mission-cta"
            >
              <span>CONTINUE INVESTIGATION</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        <section className="hq-section">
          <div className="dashboard-section-label">PROGRESS</div>
          <div className="progress-grid">
            <div className="progress-metric-box">
              <span className="metric-icon"><Zap size={16} className="text-gold" /></span>
              <div>
                <b className="metric-value">{learnerProfile.rank} ({learnerProfile.xp.toLocaleString()} XP)</b>
                <span className="metric-label">Level / Experience</span>
              </div>
            </div>

            <div className="progress-metric-box">
              <span className="metric-icon"><BookOpen size={16} className="text-blue" /></span>
              <div>
                <b className="metric-value">{learnerProfile.challengesCompleted}</b>
                <span className="metric-label">Challenges Solved</span>
              </div>
            </div>

            <div className="progress-metric-box">
              <span className="metric-icon"><ShieldCheck size={16} className="text-green" /></span>
              <div>
                <b className="metric-value">{learnerProfile.independentPasses}</b>
                <span className="metric-label">Independent Solves</span>
              </div>
            </div>

            <div className="progress-metric-box">
              <span className="metric-icon"><Flame size={16} className="text-gold" /></span>
              <div>
                <b className="metric-value">{learnerProfile.skills.length} Concepts</b>
                <span className="metric-label">Skills Developing</span>
              </div>
            </div>
          </div>
        </section>

        <section className="hq-section">
          <div className="dashboard-section-label">RECENT DEBUGGING HISTORY</div>
          <div className="recent-list">
            {mistakeLogs.slice(0, 3).map((log) => (
              <div key={log.id} className="recent-row">
                <History size={14} className="text-gold" />
                <span>
                  {log.challengeTitle} — {mistakeTaxonomyMap[log.category as MistakeCategory]?.shortTitle
                    ?? log.category.replace(/_/g, ' ')}
                </span>
              </div>
            ))}
          </div>
        </section>
      </PageContainer>
    </PageTransition>
  )
}
