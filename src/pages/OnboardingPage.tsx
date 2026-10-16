import { ArrowLeft, ArrowRight, Check, LockKeyhole, Sparkles, UserCheck } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { DojoAvatar } from '../components/avatar/DojoAvatar'
import { SenseiStage } from '../components/SenseiStage'
import { PageTransition, Badge } from '../components/ui'
import { avatarOptions, type AvatarGender } from '../config/avatarConfig'
import { useLearnerStore } from '../store/useLearnerStore'

export default function OnboardingPage() {
  const storedName = useLearnerStore((state) => state.name)
  const storedAvatar = useLearnerStore((state) => state.avatarPreference)
  const setName = useLearnerStore((state) => state.setName)
  const setAvatarPreference = useLearnerStore((state) => state.setAvatarPreference)

  const [step, setStep] = useState<1 | 2>(storedName ? 2 : 1)
  const [name, setLocalName] = useState(storedName ?? '')
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarGender>(storedAvatar ?? 'female')
  const navigate = useNavigate()

  function handleNameSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const cleanName = name.trim()
    if (!cleanName) return
    setName(cleanName)
    setStep(2)
  }

  function handleFinishOnboarding() {
    setAvatarPreference(selectedAvatar)
    navigate('/dashboard')
  }

  return (
    <PageTransition>
      <main className="onboarding-page">
        {/* Top Header */}
        <header className="onboarding-nav">
          <Link to="/" className="brand">
            <span className="brand__mark">道</span>
            <span>DEBUG <b>DOJO</b></span>
          </Link>
          <span className="onboarding-step-indicator">
            <span>0{step}</span> / 02
          </span>
        </header>

        {step === 1 ? (
          <Link to="/" className="onboarding-back-link">
            <ArrowLeft size={14} /> Back to Entrance
          </Link>
        ) : (
          <button
            type="button"
            className="onboarding-back-link text-button"
            onClick={() => setStep(1)}
          >
            <ArrowLeft size={14} /> Edit Name
          </button>
        )}

        {/* STEP 1: Name Input */}
        {step === 1 && (
          <div className="onboarding-dojo-entrance">
            <div className="onboarding-entrance__sensei">
              <SenseiStage
                state="encouraging"
                message="The first step in debugging is looking closer."
                dialoguePosition="top"
                size="lg"
              />
            </div>

            <div className="onboarding-entrance__form">
              <p className="eyebrow">
                <Sparkles size={13} /> A NOTE FROM YOUR COACH
              </p>
              <h1>
                WELCOME TO<br />
                <span>DEBUG DOJO.</span>
              </h1>

              <div className="onboarding-intro-quote">
                <p>Here, you investigate the case.</p>
                <p className="onboarding-intro__emphasis">I’ll help you find the why.</p>
              </div>

              <form onSubmit={handleNameSubmit}>
                <label htmlFor="learner-name">What should I call you?</label>
                <input
                  autoComplete="nickname"
                  id="learner-name"
                  maxLength={24}
                  onChange={(event) => setLocalName(event.target.value)}
                  placeholder="Enter your name or nickname"
                  required
                  value={name}
                />
                <p className="field-note">
                  <LockKeyhole size={12} /> A name for your training profile. No account needed.
                </p>

                <button className="button button--primary button--lg onboarding-submit-btn" type="submit">
                  <span>CONTINUE TO COACH SELECTION</span>
                  <ArrowRight size={16} />
                </button>
              </form>

              <div className="onboarding-promise">
                <Check size={14} className="text-green" />
                <span>No account required. Your progress stays on this device.</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Avatar Selection */}
        {step === 2 && (
          <div className="onboarding-avatar-selection-container">
            <div className="avatar-selection-header">
              <p className="eyebrow">
                <UserCheck size={13} /> STEP 02 / YOUR PERSONAL COACH
              </p>
              <h1>Choose Your <span>Coding Tutor.</span></h1>
              <p className="page-subtitle">
                Pick the guide you want beside you through each investigation.
              </p>
            </div>

            {/* Side-by-side Avatar Option Cards */}
            <div className="avatar-selection-grid">
              {(['female', 'male'] as AvatarGender[]).map((gender) => {
                const opt = avatarOptions[gender]
                const isSelected = selectedAvatar === gender

                return (
                  <motion.div
                    key={gender}
                    className={`avatar-option-card ${isSelected ? 'avatar-option-card--selected' : ''}`}
                    onClick={() => setSelectedAvatar(gender)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    role="button"
                    tabIndex={0}
                  >
                    {isSelected && (
                      <div className="avatar-selected-badge">
                        <Check size={12} />
                      </div>
                    )}

                    <div className="avatar-card-image-stage">
                      <DojoAvatar avatar={gender} size="lg" animated={isSelected} />
                    </div>

                    <div className="avatar-card-details">
                      <div className="avatar-card-title-row">
                        <b className="avatar-card-title">{opt.title}</b>
                        <Badge tone={opt.accentColor as any}>COACH</Badge>
                      </div>
                      <p className="avatar-card-subtitle">{opt.subtitle}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            <div className="avatar-selection-actions">
              <button
                type="button"
                className="button button--primary button--lg selection-continue-btn"
                onClick={handleFinishOnboarding}
              >
                <span>CONTINUE WITH THIS COACH</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        <footer className="onboarding-footer">
          <span>DEBUG DOJO <span className="muted">•</span> YOUR JOURNEY, YOUR PACE.</span>
          <span>0{step} / 02</span>
        </footer>
      </main>
    </PageTransition>
  )
}
