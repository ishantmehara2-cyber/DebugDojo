import { useEffect, useState } from 'react'
import {
  ChevronRight,
  Search,
  Lightbulb,
  Target,
  BarChart2,
  Flame,
  ArrowUpRight,
  ArrowRight,
  Maximize2,
  Code2,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Avatar } from '../components/ui'
import { DojoAvatar } from '../components/avatar/DojoAvatar'

const greetingLine1 = "Hi! I'm Mariaa 👋"
const greetingLine2 = "your Coding Guider."
const greetingSub = "Let's study and code today!"

const featuredCases = [
  {
    id: 'missing-return',
    caseNum: 'CASE / 001',
    lang: 'JAVASCRIPT',
    title: 'The missing return',
    desc: 'The function runs. The result vanishes. Follow the value to find where it disappears.',
    clue: 'Expected 42. Received undefined.',
    meta: 'BEGINNER · 8 MIN',
  },
  {
    id: 'last-k-total',
    caseNum: 'CASE / 002',
    lang: 'PYTHON',
    title: 'One step too far',
    desc: 'Everything adds up—until the last iteration. Look closely at where the loop ends.',
    clue: 'IndexError: list index out of range',
    meta: 'BEGINNER · 12 MIN',
  },
  {
    id: 'timing-issue',
    caseNum: 'CASE / 003',
    lang: 'JAVASCRIPT',
    title: 'A matter of timing',
    desc: 'The data is there. Just not when you need it. Trace an asynchronous alibi.',
    clue: 'The log arrives before the result.',
    meta: 'INTERMEDIATE · 15 MIN',
  },
]

export default function LandingPage() {
  const navigate = useNavigate()

  // Typewriter animation sequence for Mariaa
  const [textStage, setTextStage] = useState<number>(0)
  const [displayedLine1, setDisplayedLine1] = useState('')
  const [displayedLine2, setDisplayedLine2] = useState('')
  const [displayedSub, setDisplayedSub] = useState('')
  const [isTypingComplete, setIsTypingComplete] = useState(false)

  useEffect(() => {
    if (textStage === 0) {
      if (displayedLine1.length < greetingLine1.length) {
        const timer = setTimeout(() => {
          setDisplayedLine1(greetingLine1.slice(0, displayedLine1.length + 1))
        }, 28)
        return () => clearTimeout(timer)
      } else {
        const timer = setTimeout(() => setTextStage(1), 120)
        return () => clearTimeout(timer)
      }
    }

    if (textStage === 1) {
      if (displayedLine2.length < greetingLine2.length) {
        const timer = setTimeout(() => {
          setDisplayedLine2(greetingLine2.slice(0, displayedLine2.length + 1))
        }, 28)
        return () => clearTimeout(timer)
      } else {
        const timer = setTimeout(() => setTextStage(2), 150)
        return () => clearTimeout(timer)
      }
    }

    if (textStage === 2) {
      if (displayedSub.length < greetingSub.length) {
        const timer = setTimeout(() => {
          setDisplayedSub(greetingSub.slice(0, displayedSub.length + 1))
        }, 22)
        return () => clearTimeout(timer)
      } else if (!isTypingComplete) {
        const timer = setTimeout(() => setIsTypingComplete(true), 80)
        return () => clearTimeout(timer)
      }
    }
  }, [textStage, displayedLine1, displayedLine2, displayedSub, isTypingComplete])

  const handleCardClick = () => {
    if (!isTypingComplete) {
      setDisplayedLine1(greetingLine1)
      setDisplayedLine2(greetingLine2)
      setDisplayedSub(greetingSub)
      setIsTypingComplete(true)
    } else {
      navigate('/onboarding')
    }
  }

  return (
    <div className="landing-page-root">
      {/* 1. TOP HEADER */}
      <header className="ref-header">
        <div className="ref-header__inner">
          {/* Brand */}
          <Link to="/" className="ref-brand" aria-label="Debug Dojo home">
            <span className="ref-brand__icon">道</span>
            <span className="ref-brand__text">DEBUG <b>DOJO</b></span>
          </Link>

          {/* Center Navigation */}
          <nav className="ref-header__nav desktop-only" aria-label="Main navigation">
            <Link to="/dashboard" className="ref-nav-link">Investigation Board</Link>
            <Link to="/challenges" className="ref-nav-link">Case Files</Link>
            <Link to="/practice" className="ref-nav-link">Targeted Practice</Link>
            <Link to="/skills" className="ref-nav-link">Investigation Skills</Link>
            <Link to="/bugs" className="ref-nav-link">Mistake Diary</Link>
          </nav>

          {/* Right Controls */}
          <div className="ref-header__right">
            <div className="ref-header__stat desktop-only">
              <Flame size={15} className="text-amber" />
              <span>7 day streak</span>
            </div>
            <div className="ref-header__stat desktop-only">
              <BarChart2 size={15} className="text-teal" />
              <span>Level 3</span>
            </div>
            <Link to="/onboarding" className="button button--header-cta">
              <span>START INVESTIGATION</span>
              <ChevronRight size={15} />
            </Link>
            <Link to="/profile" className="ref-header__avatar-link" aria-label="User Profile">
              <Avatar name="Mariaa" size="sm" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTAINER */}
      <div className="ref-main-container">
        {/* HERO SECTION */}
        <section className="ref-hero">
          {/* Left Column */}
          <motion.div
            className="ref-hero__left"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className="ref-eyebrow">
              DEBUG DOJO · CODING DETECTIVE
            </div>

            <h1 className="ref-hero__title">
              Find the bug.<br />
              <span className="ref-hero__title-accent">Understand the why.</span>
            </h1>

            <p className="ref-hero__desc">
              Investigate coding mistakes with interactive clues, progressive hints, tutor guidance, and targeted practice. Build the instinct to find your own answers—not just copy a fix.
            </p>

            {/* CTAs */}
            <div className="ref-hero__ctas">
              <Link to="/onboarding" className="button button--ref-primary">
                <span>START INVESTIGATION</span>
                <ChevronRight size={16} />
              </Link>

              <Link to="/challenges" className="button button--ref-secondary">
                <span>EXPLORE CASES</span>
              </Link>
            </div>

            {/* Features */}
            <div className="ref-hero__features">
              <div className="ref-feature-pill">
                <Search size={15} className="pill-icon text-teal" />
                <span>Clues & evidence</span>
              </div>
              <div className="ref-feature-pill">
                <Target size={15} className="pill-icon text-teal" />
                <span>Stronger instincts</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Mariaa & Tutor Dialogue */}
          <motion.div
            className="ref-hero__right"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="ref-mariaa-stage">
              {/* Mariaa Composition */}
              <div className="mariaa-composition">
                {/* Dialogue Card */}
                <motion.div
                  className="ref-mariaa-card"
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  onClick={handleCardClick}
                  role="button"
                  tabIndex={0}
                >
                  <div className="ref-mariaa-card__header">
                    <span className="dot-indicator" />
                    <span>MARIAA · YOUR CODING GUIDER</span>
                  </div>

                  <h2 className="ref-mariaa-card__title">
                    {displayedLine1}<br />
                    <span>{displayedLine2}</span>
                  </h2>

                  <p className="ref-mariaa-card__sub">
                    {displayedSub}
                  </p>

                  <AnimatePresence>
                    {isTypingComplete && (
                      <motion.div
                        className="ref-mariaa-card__action"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <button
                          type="button"
                          className="button button--mariaa-continue"
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate('/onboarding')
                          }}
                        >
                          <span>YOUR FIRST LESSON</span>
                          <span>CONTINUE &gt;</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="ref-mariaa-card__pointer" aria-hidden="true" />
                </motion.div>

                {/* Avatar with Soft Sage Backdrop */}
                <div className="ref-mariaa-avatar-backdrop-wrap">
                  <div className="ref-mariaa-sage-circle" />
                  <div className="ref-mariaa-avatar-wrap">
                    <DojoAvatar
                      state={isTypingComplete ? 'idle' : 'speaking'}
                      size="lg"
                      animated
                    />
                  </div>
                </div>

                <div className="ref-avatar-caption">
                  OBSERVE. QUESTION. UNDERSTAND.
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 3. FEATURED CASE FILES SECTION */}
        <section className="ref-cases-section">
          <div className="ref-cases-header">
            <div>
              <p className="ref-eyebrow">THE CASE FILES</p>
              <h2 className="ref-section-title">Small bugs. Real discoveries.</h2>
            </div>
            <Link to="/challenges" className="ref-view-all-link">
              <span>VIEW ALL CASES</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="ref-cases-grid">
            {featuredCases.map((c) => (
              <div key={c.id} className="ref-case-card" onClick={() => navigate(`/challenge/${c.id}`)}>
                <div className="ref-case-card__top">
                  <span className="case-num">{c.caseNum}</span>
                  <span className="case-lang-pill">{c.lang}</span>
                </div>

                <h3 className="ref-case-card__title">{c.title}</h3>
                <p className="ref-case-card__desc">{c.desc}</p>

                {/* Clue Cream Box */}
                <div className="ref-case-card__clue-box">
                  <Search size={14} className="clue-icon" />
                  <span>{c.clue}</span>
                </div>

                <div className="ref-case-card__footer">
                  <span className="case-meta">{c.meta}</span>
                  <span className="case-arrow-btn">
                    <ArrowUpRight size={16} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. METHOD / EVIDENCE INTERACTIVE SECTION */}
        <section className="ref-method-split-section">
          {/* Left Evidence Board Card */}
          <div className="ref-evidence-preview-card">
            <div className="ref-evidence-header">
              <span className="case-tag">CASE 002 / EVIDENCE BOARD</span>
              <Maximize2 size={14} className="expand-icon" />
            </div>

            <div className="ref-code-window">
              <div className="code-line"><span className="ln">1</span><code>items = [4, 8, 12]</code></div>
              <div className="code-line"><span className="ln">2</span><code>total = 0</code></div>
              <div className="code-line code-line--highlight">
                <span className="ln">3</span><code>for i in range(len(items) + 1):</code>
              </div>
              <div className="code-line"><span className="ln">4</span><code>    total += items[i]</code></div>
              <div className="code-line"><span className="ln">5</span><code>print(total)</code></div>
            </div>

            {/* Clue Unlocked Box */}
            <div className="ref-evidence-clue-unlocked">
              <div className="clue-head">
                <Lightbulb size={14} />
                <span>CLUE UNLOCKED</span>
              </div>
              <p>The list has 3 items. Which index does the loop reach last?</p>
            </div>

            {/* Sensei Hint Bar */}
            <div className="ref-evidence-sensei-bar">
              <div className="sensei-head">
                <Code2 size={14} />
                <span>SENSEI · HINT 1 OF 3</span>
              </div>
              <div className="sensei-body">
                <span>Start at zero. Follow each iteration.</span>
                <ChevronRight size={15} />
              </div>
            </div>
          </div>

          {/* Right Method Copy */}
          <div className="ref-method-copy-col">
            <p className="ref-eyebrow">LESS GUESSING. MORE SEEING.</p>
            <h2 className="ref-section-title">The answer is yours<br />to uncover.</h2>
            <p className="ref-method-sub">
              Not another solution to copy. A calmer way to learn how to think when the code doesn't work.
            </p>

            <div className="ref-steps-list">
              <div className="ref-step-item">
                <span className="step-num">01</span>
                <div>
                  <h3 className="step-title">Collect the evidence</h3>
                  <p className="step-desc">Inspect the code, test your assumptions, and connect the clues.</p>
                </div>
              </div>

              <div className="ref-step-item">
                <span className="step-num">02</span>
                <div>
                  <h3 className="step-title">Find guidance, not spoilers</h3>
                  <p className="step-desc">Reveal a little at a time. Your tutor asks the questions that move you forward.</p>
                </div>
              </div>

              <div className="ref-step-item">
                <span className="step-num">03</span>
                <div>
                  <h3 className="step-title">Turn a fix into an instinct</h3>
                  <p className="step-desc">Put the lesson to work with targeted practice. Solve it once. Recognize it next time.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="ref-footer">
          <span>DEBUG DOJO <span className="muted">•</span> CODING DETECTIVE</span>
          <span>INVESTIGATE • LEARN • MASTER</span>
        </footer>
      </div>
    </div>
  )
}
