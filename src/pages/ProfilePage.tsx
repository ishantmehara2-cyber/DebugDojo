import { ScrollText, Award, BookOpen, Flame, ShieldCheck, Zap, UserCheck, Check } from 'lucide-react'
import { PageTransition, PageContainer, Badge } from '../components/ui'
import { DojoAvatar } from '../components/avatar/DojoAvatar'
import { avatarOptions, type AvatarGender } from '../config/avatarConfig'
import { learnerProfile } from '../data/mockData'
import { useLearnerStore } from '../store/useLearnerStore'

export default function ProfilePage() {
  const name = useLearnerStore((state) => state.name) ?? learnerProfile.name
  const avatarPref = useLearnerStore((state) => state.avatarPreference) ?? 'female'
  const setAvatarPref = useLearnerStore((state) => state.setAvatarPreference)

  return (
    <PageTransition>
      <PageContainer className="profile-page">
        <header className="page-header">
          <p className="eyebrow">
            <ScrollText size={13} /> PROFILE / DEVELOPER RECORD
          </p>
          <h1>{name}’s <span>Profile.</span></h1>
          <p className="page-subtitle">Your progress, training metrics, and milestone history.</p>
        </header>

        {/* Profile Overview Bar */}
        <div className="profile-hero-bar">
          <div className="profile-hero-bar__left">
            <div className="profile-avatar-circle">{name.charAt(0).toUpperCase()}</div>
            <div>
              <b className="profile-name">{name}</b>
              <div className="profile-rank-row">
                <Badge tone="blue">BLUE BELT</Badge>
                <span className="profile-xp">• {learnerProfile.xp.toLocaleString()} XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="profile-stats-grid">
          <div className="profile-stat-box">
            <Zap size={16} className="text-gold" />
            <div>
              <b className="stat-val">{learnerProfile.xp.toLocaleString()}</b>
              <span className="stat-lbl">Experience XP</span>
            </div>
          </div>

          <div className="profile-stat-box">
            <Flame size={16} className="text-gold" />
            <div>
              <b className="stat-val">{learnerProfile.streak} days</b>
              <span className="stat-lbl">Training Streak</span>
            </div>
          </div>

          <div className="profile-stat-box">
            <BookOpen size={16} className="text-blue" />
            <div>
              <b className="stat-val">{learnerProfile.challengesCompleted}</b>
              <span className="stat-lbl">Challenges Solved</span>
            </div>
          </div>

          <div className="profile-stat-box">
            <ShieldCheck size={16} className="text-green" />
            <div>
              <b className="stat-val">{learnerProfile.independentPasses}</b>
              <span className="stat-lbl">Independent Passes</span>
            </div>
          </div>
        </div>

        {/* Coach Avatar Switcher Section */}
        <section className="profile-coach-section">
          <div className="dashboard-section-label">
            <UserCheck size={13} /> COACH AVATAR SETTINGS
          </div>
          <div className="coach-switcher-panel">
            <div className="coach-switcher-intro">
              <b>Your Personal Coding Coach</b>
              <p>Change your coach identity anytime. Your learning progress, XP, and streak remain completely preserved.</p>
            </div>

            <div className="coach-options-grid">
              {(['female', 'male'] as AvatarGender[]).map((gender) => {
                const opt = avatarOptions[gender]
                const isSelected = avatarPref === gender

                return (
                  <div
                    key={gender}
                    className={`coach-option-card ${isSelected ? 'coach-option-card--selected' : ''}`}
                    onClick={() => setAvatarPref(gender)}
                    role="button"
                    tabIndex={0}
                  >
                    {isSelected && (
                      <div className="coach-selected-check">
                        <Check size={12} />
                      </div>
                    )}
                    <div className="coach-card-avatar">
                      <DojoAvatar avatar={gender} size="sm" animated={isSelected} />
                    </div>
                    <div className="coach-card-text">
                      <b className="coach-card-title">{opt.title}</b>
                      <p className="coach-card-sub">{opt.subtitle}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Milestones History List */}
        <div className="profile-history-section">
          <div className="dashboard-section-label">EARNED MILESTONES</div>
          <div className="milestones-list">
            {learnerProfile.milestones.map((m, idx) => (
              <div key={idx} className="milestone-row">
                <Award size={15} className="text-gold" />
                <span>{m}</span>
              </div>
            ))}
          </div>
        </div>
      </PageContainer>
    </PageTransition>
  )
}
