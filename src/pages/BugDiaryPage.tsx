import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  AlertTriangle,
  ArrowRight,
  Brain,
  Bug,
  CheckCircle2,
  Search,
  ShieldAlert,
  Trash2,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge, Button, Modal, PageContainer, PageTransition } from '../components/ui'
import { mistakeTaxonomyMap } from '../data/mistakesTaxonomy'
import { useLearningLoopStore, type MistakeLogEntry } from '../store/useLearningLoopStore'
import type { MistakeCategory } from '../types/challenge'

type DiaryFilter = 'all' | 'recurring' | 'syntax' | 'logic' | 'runtime' | 'resolved' | 'practicing'
type DiarySort = 'newest' | 'oldest' | 'frequent' | 'practice'

const syntaxCategories = new Set([
  'syntax_error', 'indentation_error', 'missing_colon', 'missing_parenthesis',
  'missing_bracket', 'missing_quote', 'unexpected_token', 'invalid_operator',
  'incomplete_code', 'empty_submission', 'function_signature_error',
])
const runtimeCategories = new Set([
  'type_error', 'index_error', 'key_error', 'name_error', 'attribute_error',
  'infinite_loop', 'timeout', 'memory_limit', 'resource_limit', 'undefined_variable',
  'wrong_variable_name',
])

function readableCategory(category: string): string {
  const taxonomy = mistakeTaxonomyMap[category as MistakeCategory]
  if (taxonomy) {
    return taxonomy.label.toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase())
  }
  return category
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function getTimestamp(entry: MistakeLogEntry): Date | null {
  const value = entry.mistakeDetectedAt ?? entry.createdAt ?? entry.timestamp
  if (!/^\d{4}-\d{2}-\d{2}T/.test(value)) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function formatDate(entry: MistakeLogEntry) {
  const date = getTimestamp(entry)
  if (!date) {
    return {
      day: entry.date || 'Date unavailable',
      time: entry.timestamp !== entry.date ? entry.timestamp : '',
      full: [entry.date, entry.timestamp !== entry.date ? entry.timestamp : ''].filter(Boolean).join(' · '),
    }
  }

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const entryDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const daysAgo = Math.round((today.getTime() - entryDay.getTime()) / 86400000)
  const day = daysAgo === 0
    ? 'Today'
    : daysAgo === 1
      ? 'Yesterday'
      : date.toLocaleDateString([], { month: 'short', day: 'numeric' })

  return {
    day,
    time: date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
    full: date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
  }
}

function getStatus(entry: MistakeLogEntry): 'still-practicing' | 'improving' | 'resolved' {
  if (entry.status) return entry.status
  if (entry.resolved) return 'resolved'
  return entry.hintsUsed || entry.hintLevelUsed ? 'improving' : 'still-practicing'
}

export default function BugDiaryPage() {
  const {
    mistakeLogs,
    getCategoryStats,
    deleteMistake,
    markMistakeReviewed,
  } = useLearningLoopStore()
  const [filter, setFilter] = useState<DiaryFilter>('all')
  const [sort, setSort] = useState<DiarySort>('newest')
  const [search, setSearch] = useState('')
  const [selectedEntry, setSelectedEntry] = useState<MistakeLogEntry | null>(null)
  const [entryToDelete, setEntryToDelete] = useState<MistakeLogEntry | null>(null)
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 3200)
    return () => window.clearTimeout(timer)
  }, [toast])

  const recurringCategories = useMemo(() => {
    const challengesByCategory = new Map<string, Set<string>>()
    mistakeLogs.forEach((entry) => {
      const challengeIds = challengesByCategory.get(entry.category) ?? new Set<string>()
      challengeIds.add(entry.challengeId)
      challengesByCategory.set(entry.category, challengeIds)
    })
    return new Set(
      [...challengesByCategory.entries()]
        .filter(([, challengeIds]) => challengeIds.size >= 2)
        .map(([category]) => category),
    )
  }, [mistakeLogs])

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>()
    mistakeLogs.forEach((entry) => counts.set(entry.category, (counts.get(entry.category) ?? 0) + 1))
    return counts
  }, [mistakeLogs])

  const mostCommonCategory = [...categoryCounts.entries()]
    .sort(([, countA], [, countB]) => countB - countA)[0]?.[0]

  const visibleEntries = useMemo(() => {
    const query = search.trim().toLowerCase()
    const filtered = mistakeLogs.filter((entry) => {
      const category = entry.category.toLowerCase()
      const status = getStatus(entry)
      const categoryMatch = filter === 'all'
        || (filter === 'recurring' && recurringCategories.has(entry.category))
        || (filter === 'syntax' && syntaxCategories.has(category))
        || (filter === 'runtime' && runtimeCategories.has(category))
        || (filter === 'logic' && !syntaxCategories.has(category) && !runtimeCategories.has(category))
        || (filter === 'resolved' && status === 'resolved')
        || (filter === 'practicing' && status !== 'resolved')
      const searchMatch = !query || [
        readableCategory(entry.category),
        entry.challengeTitle,
        entry.explanation,
        entry.whyItMatters,
        entry.concept,
        ...(entry.concepts ?? []),
      ].some((value) => value?.toLowerCase().includes(query))
      return categoryMatch && searchMatch
    })

    return filtered.sort((a, b) => {
      if (sort === 'frequent') {
        return (getCategoryStats(b.category).occurrences - getCategoryStats(a.category).occurrences)
          || ((getTimestamp(b)?.getTime() ?? 0) - (getTimestamp(a)?.getTime() ?? 0))
      }
      if (sort === 'practice') {
        return Number(getStatus(a) === 'resolved') - Number(getStatus(b) === 'resolved')
          || ((getTimestamp(b)?.getTime() ?? 0) - (getTimestamp(a)?.getTime() ?? 0))
      }
      const difference = (getTimestamp(b)?.getTime() ?? 0) - (getTimestamp(a)?.getTime() ?? 0)
      return sort === 'newest' ? difference : -difference
    })
  }, [filter, getCategoryStats, mistakeLogs, recurringCategories, search, sort])

  const confirmDelete = () => {
    if (!entryToDelete) return
    deleteMistake(entryToDelete.id)
    if (selectedEntry?.id === entryToDelete.id) setSelectedEntry(null)
    setEntryToDelete(null)
    setToast('Mistake removed from your diary.')
  }

  const filters: Array<{ id: DiaryFilter; label: string }> = [
    { id: 'all', label: 'All' },
    { id: 'recurring', label: 'Recurring' },
    { id: 'syntax', label: 'Syntax' },
    { id: 'logic', label: 'Logic' },
    { id: 'runtime', label: 'Runtime' },
    { id: 'resolved', label: 'Resolved' },
    { id: 'practicing', label: 'Still Practicing' },
  ]

  return (
    <PageTransition>
      <PageContainer className="bug-diary-page">
        <header className="page-header bug-diary-header">
          <p className="eyebrow"><Bug size={13} /> JOURNAL / DISCOVERED PATTERNS</p>
          <h1>Bug <span>Diary.</span></h1>
          <p className="page-subtitle">Your mistakes are becoming patterns.</p>
        </header>

        <section className="bug-diary-summary" aria-label="Mistake diary statistics">
          <div className="bug-diary-summary__stat">
            <span>Mistakes found</span>
            <strong>{mistakeLogs.length}</strong>
          </div>
          <div className="bug-diary-summary__stat">
            <span>Recurring patterns</span>
            <strong>{recurringCategories.size}</strong>
          </div>
          <div className="bug-diary-summary__stat bug-diary-summary__stat--common">
            <span>Most common mistake</span>
            <strong>{mostCommonCategory ? readableCategory(mostCommonCategory) : '—'}</strong>
          </div>
        </section>

        {mistakeLogs.length > 0 && (
          <section className="bug-diary-toolbar" aria-label="Search and filter mistakes">
            <label className="bug-diary-search">
              <Search size={16} aria-hidden="true" />
              <span className="visually-hidden">Search your mistakes</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search your mistakes…"
              />
            </label>
            <div className="bug-diary-filters" role="group" aria-label="Filter mistakes">
              {filters.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`bug-diary-filter${filter === item.id ? ' is-active' : ''}`}
                  aria-pressed={filter === item.id}
                  onClick={() => setFilter(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <label className="bug-diary-sort">
              <span>Sort</span>
              <select value={sort} onChange={(event) => setSort(event.target.value as DiarySort)}>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="frequent">Most Frequent</option>
                <option value="practice">Needs Practice</option>
              </select>
            </label>
          </section>
        )}

        {mistakeLogs.length === 0 ? (
          <section className="bug-diary-empty">
            <span className="bug-diary-empty__icon"><Brain size={28} /></span>
            <h2>Your Bug Diary is empty.</h2>
            <p>That’s a good sign. Solve a challenge and your learning patterns will appear here.</p>
            <Link to="/challenges" className="button button--primary">
              Explore Challenges <ArrowRight size={15} />
            </Link>
          </section>
        ) : visibleEntries.length === 0 ? (
          <section className="bug-diary-no-results">
            <Search size={20} />
            <p>No mistakes match this search or filter.</p>
            <button type="button" onClick={() => { setSearch(''); setFilter('all') }}>Clear filters</button>
          </section>
        ) : (
          <section className="diary-timeline" aria-label="Your mistake history">
            <AnimatePresence mode="popLayout">
              {visibleEntries.map((entry) => {
                const stats = getCategoryStats(entry.category)
                const taxonomy = mistakeTaxonomyMap[entry.category as MistakeCategory]
                const concepts = entry.concepts?.length
                  ? entry.concepts
                  : entry.concept?.split(',').map((concept) => concept.trim()).filter(Boolean)
                    ?? taxonomy?.targetConcepts
                    ?? []
                const date = formatDate(entry)
                const status = getStatus(entry)

                return (
                  <motion.article
                    key={entry.id}
                    className="diary-entry"
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.985 }}
                    transition={{ duration: 0.18 }}
                  >
                    <div className="diary-entry__date">
                      <span className="diary-entry__date-icon"><AlertTriangle size={16} /></span>
                      <span className="diary-entry__date-day">{date.day}</span>
                      {date.time && <time dateTime={entry.mistakeDetectedAt ?? entry.createdAt ?? undefined} title={date.full}>{date.time}</time>}
                    </div>

                    <div className="diary-entry__content">
                      <div className="diary-entry__heading">
                        <div className="diary-entry__title-wrap">
                          <h2 className="diary-entry__cat">{readableCategory(entry.category)}</h2>
                          <span className="diary-entry__chal">{entry.challengeTitle}</span>
                        </div>
                        <div className="diary-entry__badges">
                          {stats.isRecurring && (
                            <Badge tone="gold"><ShieldAlert size={11} /> RECURRING</Badge>
                          )}
                          <Badge tone={status === 'resolved' ? 'green' : status === 'improving' ? 'blue' : 'muted'}>
                            {status === 'resolved' ? <CheckCircle2 size={11} /> : null}
                            {status === 'resolved' ? 'RESOLVED' : status === 'improving' ? 'IMPROVING' : 'STILL PRACTICING'}
                          </Badge>
                        </div>
                      </div>

                      <p className="diary-entry__note">
                        {entry.explanation ?? taxonomy?.plainExplanation ?? 'A coding pattern worth reviewing was detected.'}
                      </p>
                      {stats.isRecurring && (
                        <p className="diary-entry__recurring-note">
                          You’ve encountered this pattern a few times. One focused practice can help it stick.
                        </p>
                      )}
                      {concepts.length > 0 && (
                        <div className="diary-entry__concepts" aria-label="Related concepts">
                          {concepts.map((concept) => <span className="diary-entry__concept" key={concept}>{concept}</span>)}
                        </div>
                      )}
                      <div className="diary-entry__meta">
                        {entry.severity && <span className={`diary-entry__severity diary-entry__severity--${entry.severity}`}>{entry.severity} severity</span>}
                        <span>Attempt #{entry.attemptNumber ?? 1}</span>
                        <span>{entry.hintsUsed ?? entry.hintLevelUsed ?? 0} hints used</span>
                        {entry.hiddenOrVisibleFailure && (
                          <span>{entry.hiddenOrVisibleFailure === 'hidden' ? 'Protected edge case' : 'Visible case'}</span>
                        )}
                        {stats.isRecurring && <span>{stats.occurrences} occurrences · {stats.distinctChallengesCount} challenges</span>}
                      </div>
                    </div>

                    <div className="diary-entry__actions">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          markMistakeReviewed(entry.id)
                          setSelectedEntry(entry)
                        }}
                      >
                        Review <ArrowRight size={14} />
                      </Button>
                      <button
                        type="button"
                        className="diary-entry__delete"
                        aria-label={`Delete ${readableCategory(entry.category)} from diary`}
                        onClick={() => setEntryToDelete(entry)}
                      >
                        <Trash2 size={15} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </motion.article>
                )
              })}
            </AnimatePresence>
          </section>
        )}
      </PageContainer>

      <Modal
        open={Boolean(selectedEntry)}
        title={selectedEntry ? readableCategory(selectedEntry.category) : 'Review mistake'}
        onClose={() => setSelectedEntry(null)}
      >
        {selectedEntry && (() => {
          const stats = getCategoryStats(selectedEntry.category)
          const taxonomy = mistakeTaxonomyMap[selectedEntry.category as MistakeCategory]
          const practicePath = `/challenge/${selectedEntry.recommendedPractice ?? selectedEntry.challengeId}`
          return (
            <div className="diary-review">
              <p className="diary-review__challenge">{selectedEntry.challengeTitle}</p>
              <section>
                <h3>What happened?</h3>
                <p>{selectedEntry.explanation ?? taxonomy?.plainExplanation ?? 'A coding pattern worth reviewing was detected.'}</p>
              </section>
              {selectedEntry.whyItMatters && (
                <section>
                  <h3>Why it matters</h3>
                  <p>{selectedEntry.whyItMatters}</p>
                </section>
              )}
              <section>
                <h3>Learning history</h3>
                <p>First recorded: {formatDate(selectedEntry).full || 'Date unavailable'}</p>
                <p>{stats.occurrences} occurrence{stats.occurrences === 1 ? '' : 's'} across {stats.distinctChallengesCount} challenge{stats.distinctChallengesCount === 1 ? '' : 's'}.</p>
                {stats.challenges.length > 0 && (
                  <ul>{stats.challenges.map((challenge) => <li key={challenge.id}>{challenge.title}</li>)}</ul>
                )}
                <p>Attempt #{selectedEntry.attemptNumber ?? 1} · {selectedEntry.hintsUsed ?? selectedEntry.hintLevelUsed ?? 0} hints used</p>
              </section>
              {(selectedEntry.codeSnapshot || selectedEntry.relevantCodeContext) && (
                <section>
                  <h3>Your code</h3>
                  <pre className="diary-review__code"><code>{selectedEntry.codeSnapshot ?? selectedEntry.relevantCodeContext}</code></pre>
                </section>
              )}
              <section>
                <h3>What to remember</h3>
                <p>{selectedEntry.whyItMatters ?? taxonomy?.sampleQuestion ?? 'Pause to check how this behavior affects the result.'}</p>
              </section>
              <Link
                to={practicePath}
                className="button button--primary diary-review__practice"
                onClick={() => setSelectedEntry(null)}
              >
                Practice This Again <ArrowRight size={15} />
              </Link>
            </div>
          )
        })()}
      </Modal>

      <Modal
        open={Boolean(entryToDelete)}
        title="Delete this mistake?"
        onClose={() => setEntryToDelete(null)}
      >
        <div className="diary-delete-confirm">
          <p>This will remove this mistake from your Bug Diary. Your other learning progress will not be affected.</p>
          <div className="diary-delete-confirm__actions">
            <Button variant="secondary" onClick={() => setEntryToDelete(null)}>Cancel</Button>
            <Button variant="primary" className="diary-delete-confirm__danger" onClick={confirmDelete}>
              <Trash2 size={14} /> Delete Mistake
            </Button>
          </div>
        </div>
      </Modal>

      <AnimatePresence>
        {toast && (
          <motion.div
            className="bug-diary-toast"
            role="status"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            <CheckCircle2 size={16} /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}
