import { useState } from 'react'
import { ChartNoAxesColumnIncreasing, Target, CircleHelp, ShieldCheck, ArrowRight, Check, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageTransition, PageContainer, ProgressBar, Badge } from '../components/ui'
import { useLearningLoopStore } from '../store/useLearningLoopStore'

const skillEvidenceMap: Record<string, Array<{ title: string; pass: boolean; type: string; challengeId: string }>> = {
  Boundaries: [
    { title: 'Last-k Total', pass: true, type: 'Independent', challengeId: 'last-k-total' },
    { title: 'Count Passes', pass: true, type: 'Independent', challengeId: 'count-passes' },
    { title: 'Middle Three Values', pass: false, type: 'Failed attempt', challengeId: 'middle-three' },
  ],
  Lists: [
    { title: 'Count Passes', pass: true, type: 'Independent', challengeId: 'count-passes' },
    { title: 'Last-k Total', pass: true, type: 'Independent', challengeId: 'last-k-total' },
    { title: 'Filter & Double Positives', pass: true, type: 'Hint-assisted', challengeId: 'double-positives' },
  ],
  Indexing: [
    { title: 'Middle Three Values', pass: true, type: 'Hint-assisted', challengeId: 'middle-three' },
    { title: 'Find Peak Element', pass: true, type: 'Independent', challengeId: 'find-peak' },
  ],
  Functions: [
    { title: 'Find First Even Number', pass: true, type: 'Independent', challengeId: 'first-even' },
    { title: 'Sum Up To N', pass: true, type: 'Independent', challengeId: 'sum-upto' },
  ],
}

export default function SkillsPage() {
  const { conceptMastery } = useLearningLoopStore()
  const skillsList = Object.values(conceptMastery)
  const [selectedConcept, setSelectedConcept] = useState<string>('Boundaries')

  const activeRecord = conceptMastery[selectedConcept] ?? skillsList[0]
  const evidence = skillEvidenceMap[selectedConcept] ?? skillEvidenceMap.Boundaries

  return (
    <PageTransition>
      <PageContainer className="skills-page">
        <header className="page-header">
          <p className="eyebrow">
            <ChartNoAxesColumnIncreasing size={13} /> SKILL MAP / FOUNDATION
          </p>
          <h1>Debugging <span>Mastery.</span></h1>
          <p className="page-subtitle">
            “Your progress is measured by how independently you debug.”
          </p>
        </header>

        {/* Skill Map List with Thin Progress Bars */}
        <div className="skills-map-section">
          <div className="dashboard-section-label">CONCEPT MASTERY OVERVIEW</div>
          <div className="skills-map-list">
            {skillsList.map((skill) => {
              const isSelected = skill.name === selectedConcept
              return (
                <div
                  key={skill.name}
                  className={`skill-map-row ${isSelected ? 'skill-map-row--selected' : ''}`}
                  onClick={() => setSelectedConcept(skill.name)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="skill-map-row__label">
                    <Target size={14} className="text-gold" />
                    <span>{skill.name}</span>
                  </div>

                  <div className="skill-map-row__bar">
                    <ProgressBar
                      value={skill.mastery}
                      color="gold"
                      label={`${skill.name} mastery`}
                    />
                  </div>

                  <span className="skill-map-row__val">
                    <b>{skill.mastery}%</b>
                    <small>{skill.trend}</small>
                  </span>
                </div>
              )
            })}
          </div>

          <div className="skills-note">
            <CircleHelp size={14} />
            <span>
              Passing independently adds <strong>+12%</strong> mastery. Passing with hints adds <strong>+4%</strong> mastery.
            </span>
          </div>
        </div>

        {/* Selected Concept Deep Dive Detail */}
        {activeRecord && (
          <section className="concept-detail-card">
            <div className="concept-detail-header">
              <div>
                <span className="dashboard-section-label">SELECTED CONCEPT</span>
                <h2>{activeRecord.name} ({activeRecord.mastery}% Mastery)</h2>
              </div>
              <Badge tone="gold">
                <ShieldCheck size={12} />
                <span>{activeRecord.independentPasses} INDEPENDENT SOLVES</span>
              </Badge>
            </div>

            <div className="concept-detail-grid">
              <div className="concept-detail-box">
                <b className="text-green">Doing Well:</b>
                <p>Recognizing boundaries when inputs are within typical ranges.</p>
              </div>

              <div className="concept-detail-box">
                <b className="text-gold">Still Developing:</b>
                <p>Handling empty collection checks and unexpected short lengths.</p>
              </div>
            </div>

            {/* Recent Evidence History */}
            <div className="concept-evidence-section">
              <span className="dashboard-section-label">RECENT EVIDENCE HISTORY</span>
              <div className="evidence-list">
                {evidence.map((item, idx) => (
                  <div key={idx} className="evidence-row">
                    <span className={item.pass ? 'evidence-icon--pass' : 'evidence-icon--fail'}>
                      {item.pass ? <Check size={12} /> : <X size={12} />}
                    </span>
                    <b className="evidence-title">{item.title}</b>
                    <span className="evidence-type">• {item.type}</span>
                    <Link to={`/challenge/${item.challengeId}`} className="text-link flex-end">
                      <span>Practice Challenge</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="concept-detail-actions">
              <Link
                to="/challenges"
                className="button button--primary button--md"
              >
                <span>PRACTICE THIS SKILL →</span>
              </Link>
            </div>
          </section>
        )}
      </PageContainer>
    </PageTransition>
  )
}
