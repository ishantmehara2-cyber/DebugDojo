import { useSearchParams, Link } from 'react-router-dom'
import { BookOpenCheck, ArrowRight, ShieldAlert, Target } from 'lucide-react'
import { PageTransition, PageContainer, Badge } from '../components/ui'
import { mistakeTaxonomyMap } from '../data/mistakesTaxonomy'
import { challengesData } from '../data/challengesData'
import { useLearningLoopStore } from '../store/useLearningLoopStore'
import type { MistakeCategory } from '../types/challenge'

const trainingSteps = [
  { step: '01', title: 'RECOGNIZE', desc: 'Identify the risky assumption in the logic.' },
  { step: '02', title: 'PREDICT', desc: 'Predict what happens when an edge input is passed.' },
  { step: '03', title: 'TRACE', desc: 'Trace execution step-by-step through the boundaries.' },
  { step: '04', title: 'DEBUG', desc: 'Make the structural correction yourself in Monaco.' },
  { step: '05', title: 'PROVE IT', desc: 'Solve a fresh challenge independently without hints.' },
]

export default function PracticePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryParam = searchParams.get('category') ?? searchParams.get('mistake') ?? 'unhandled_short_input'
  const activeCategory = (categoryParam as MistakeCategory) in mistakeTaxonomyMap
    ? (categoryParam as MistakeCategory)
    : 'unhandled_short_input'

  const activeInfo = mistakeTaxonomyMap[activeCategory]
  const { getCategoryStats } = useLearningLoopStore()
  const stats = getCategoryStats(activeCategory)

  // Filter challenges relevant to active mistake category
  const targetedChallenges = challengesData.filter((c) =>
    c.mistakeCategories.includes(activeCategory)
  )

  const allCategories: MistakeCategory[] = [
    'unhandled_short_input',
    'off_by_one',
    'print_not_return',
    'boundary_comparison',
    'mutates_input',
  ]

  return (
    <PageTransition>
      <PageContainer className="practice-page">
        <header className="page-header practice-page__header">
          <p className="eyebrow">
            <BookOpenCheck size={13} /> TRAINING ROOM / TARGETED PRACTICE
          </p>
          <h1>Practice Your <span>Mistakes.</span></h1>
          <p className="page-subtitle">“Turn recurring mistakes into instincts.”</p>
        </header>

        {/* Mistake Category Selector Tabs */}
        <nav className="practice-category-tabs" aria-label="Practice topics">
          {allCategories.map((cat) => {
            const catStats = getCategoryStats(cat)
            const info = mistakeTaxonomyMap[cat]
            const isSelected = cat === activeCategory

            return (
              <button
                key={cat}
                type="button"
                className={`category-tab ${isSelected ? 'category-tab--active' : ''}`}
                onClick={() => setSearchParams({ category: cat })}
                aria-pressed={isSelected}
              >
                <span>{info.shortTitle}</span>
                {catStats.isRecurring && (
                  <span className="recurring-dot" title="Recurring pattern detected" />
                )}
              </button>
            )
          })}
        </nav>

        {/* Focus Area Card */}
        <section className="focus-area-card">
          <div className="focus-area-head">
            <div className="focus-area-title-group">
              <span className="dashboard-section-label">FOCUS AREA</span>
              <h2>{activeInfo.label}</h2>
              <p>{activeInfo.plainExplanation}</p>
            </div>
            <div className="focus-area-status">
              {stats.isRecurring ? (
                <Badge tone="gold">
                  <ShieldAlert size={12} />
                  <span>PATTERN DETECTED · {stats.distinctChallengesCount} CHALLENGES</span>
                </Badge>
              ) : (
                <Badge tone="muted">ONE-OFF MISTAKE</Badge>
              )}
            </div>
          </div>

          {/* 5-Step Training Progression */}
          <ol className="training-progression-grid">
            {trainingSteps.map((s) => (
              <li key={s.step} className="progression-step-box">
                <span className="step-num">{s.step}</span>
                <div className="progression-step-copy">
                  <b className="step-title">{s.title}</b>
                  <p className="step-desc">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Targeted Practice Challenges List */}
        <section className="targeted-challenges-section">
          <div className="dashboard-section-label">TARGETED PRACTICE CHALLENGES</div>
          <div className="practice-challenges-list">
            {targetedChallenges.map((challenge, idx) => (
              <article key={challenge.id} className="practice-challenge-row">
                <div className="practice-challenge-info">
                  <div className="practice-idx">PRACTICE 0{idx + 1}</div>
                  <div className="practice-challenge-copy">
                    <h3 className="practice-challenge-title">{challenge.title}</h3>
                    <p className="practice-challenge-reason">
                      <Target size={13} className="text-gold" />
                      <span className="practice-challenge-target">
                        <strong className="practice-target-label">TARGET</strong>
                        <span className="practice-target-name">{activeInfo.shortTitle}</span>
                        <span className="practice-target-description">{challenge.learningObjective}</span>
                      </span>
                    </p>
                  </div>
                </div>

                <div className="practice-challenge-right">
                  <Badge tone={challenge.difficulty === 'Easy' ? 'green' : 'gold'}>
                    {challenge.difficulty.toUpperCase()}
                  </Badge>
                  <Link
                    to={`/challenge/${challenge.id}`}
                    className="button button--primary button--sm"
                  >
                    <span>PRACTICE NOW</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </PageContainer>
    </PageTransition>
  )
}
