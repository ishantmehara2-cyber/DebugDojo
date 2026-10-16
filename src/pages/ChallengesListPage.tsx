import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Swords, ArrowRight, Filter, Clock3 } from 'lucide-react'
import { PageTransition, PageContainer, Badge } from '../components/ui'
import { challengesData } from '../data/challengesData'

export default function ChallengesListPage() {
  const [filterDifficulty, setFilterDifficulty] = useState<string>('ALL')

  const filteredChallenges = challengesData.filter((c) => {
    if (filterDifficulty === 'ALL') return true
    return c.difficulty.toUpperCase() === filterDifficulty
  })

  return (
    <PageTransition>
      <PageContainer className="challenges-page">
        <header className="page-header">
          <p className="eyebrow">
            <Swords size={13} /> CASE FILES / INVESTIGATION CATALOG
          </p>
          <h1>Case <span>Files.</span></h1>
          <p className="page-subtitle">Choose the next coding case to investigate.</p>
        </header>

        {/* Filter Bar */}
        <div className="challenges-filter-bar" role="group" aria-label="Filter cases by difficulty">
          <span className="filter-label">
            <Filter size={13} /> Filter:
          </span>
          {['ALL', 'EASY', 'MEDIUM', 'HARD'].map((diff) => (
            <button
              key={diff}
              type="button"
              className={`button button--sm ${filterDifficulty === diff ? 'button--primary' : 'button--ghost'}`}
              onClick={() => setFilterDifficulty(diff)}
              aria-pressed={filterDifficulty === diff}
            >
              {diff}
            </button>
          ))}
        </div>

        {/* Clean Challenge Rows */}
        <section className="challenges-list" aria-label="Available cases">
          {filteredChallenges.map((challenge, idx) => {
            const badgeTone: 'green' | 'gold' | 'rose' =
              challenge.difficulty === 'Easy' ? 'green' : challenge.difficulty === 'Medium' ? 'gold' : 'rose'

            return (
              <article key={challenge.id} className="challenge-row">
                <div className="challenge-row__left">
                  <span className="challenge-row__idx">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="challenge-row__copy">
                    <h3 className="challenge-row__title">{challenge.title}</h3>
                    <p className="challenge-row__obj">{challenge.learningObjective}</p>
                    <div className="challenge-row__tags">
                      {challenge.conceptTags.map((tag) => (
                        <span key={tag} className="concept-tag">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="challenge-row__right">
                  <Badge tone={badgeTone}>{challenge.difficulty.toUpperCase()}</Badge>
                  <span className="meta-time">
                    <Clock3 size={12} /> {challenge.duration}
                  </span>
                  <Link
                    to={`/challenge/${challenge.id}`}
                    className="button button--primary button--sm"
                    aria-label={`Open case: ${challenge.title}`}
                  >
                    <span>OPEN CASE</span>
                    <ArrowRight size={13} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            )
          })}
        </section>
      </PageContainer>
    </PageTransition>
  )
}
