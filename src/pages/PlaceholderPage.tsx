import { ArrowRight, Award, BookOpenCheck, Bug, ChartNoAxesColumnIncreasing, ScrollText, Swords } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge, Card, PageContainer, PageTransition, SectionHeader } from '../components/ui'
import { learnerProfile } from '../data/mockData'
import { useLearnerStore } from '../store/useLearnerStore'

const pageContent = {
  challenges: {
    title: 'Challenges',
    eyebrow: 'THE TRAINING FLOOR',
    description: 'Carefully chosen bugs, designed to sharpen how you reason—not how fast you type.',
    icon: Swords,
    status: 'Challenge library is coming up next.',
    features: ['Adaptive challenge paths', 'Guided debugging sessions', 'Independent pass tracking'],
  },
  practice: {
    title: 'Practice room',
    eyebrow: 'YOUR DAILY PRACTICE',
    description: 'A quiet place to slow down, follow the evidence, and build better debugging instincts.',
    icon: BookOpenCheck,
    status: 'The practice room is being prepared.',
    features: ['Focused daily drills', 'Thoughtful hint progression', 'Reflection after every fix'],
  },
  skills: {
    title: 'Skill dojo',
    eyebrow: 'YOUR SKILL MAP',
    description: 'See the concepts you’ve strengthened and the areas ready for a little more attention.',
    icon: ChartNoAxesColumnIncreasing,
    status: 'Your skill map will grow with every training session.',
    features: learnerProfile.skills.map((skill) => `${skill.name} · ${skill.mastery}% mastery`),
  },
  bugs: {
    title: 'Bug diary',
    eyebrow: 'PATTERNS, NOT MISTAKES',
    description: 'A personal record of the bug patterns you’ve uncovered and the lessons you’ve earned.',
    icon: Bug,
    status: 'Your discoveries will be collected here.',
    features: learnerProfile.bugDiary,
  },
  achievements: {
    title: 'Achievements',
    eyebrow: 'MILESTONES EARNED',
    description: 'A record of the persistence, curiosity, and independent thinking that brought you here.',
    icon: Award,
    status: 'Your next milestone is already taking shape.',
    features: learnerProfile.achievements.map((achievement) => achievement.title),
  },
  profile: {
    title: 'Your profile',
    eyebrow: 'THE LEARNER BEHIND THE JOURNEY',
    description: 'Your progress, learning history, and training story—kept together in one place.',
    icon: ScrollText,
    status: 'Your learner profile is taking shape.',
    features: ['Rank & XP', 'Mastery & skills', 'Achievements & milestones', 'Bug diary & learning history'],
  },
}

type PageKey = keyof typeof pageContent

export default function PlaceholderPage({ page }: { page: PageKey }) {
  const content = pageContent[page]
  const Icon = content.icon
  const learnerName = useLearnerStore((state) => state.name) ?? learnerProfile.name
  const isProfile = page === 'profile'

  return (
    <PageTransition>
      <PageContainer className="placeholder-page">
        <div className="placeholder-heading">
          <div>
            <p className="eyebrow">{content.eyebrow}</p>
            <h1>{isProfile ? `${learnerName}’s profile` : content.title}</h1>
            <p>{content.description}</p>
          </div>
          {isProfile && <Badge tone="gold">{learnerProfile.rank.toUpperCase()}</Badge>}
        </div>
        <Card className="placeholder-hero">
          <div className="placeholder-hero__icon"><Icon size={25} /></div>
          <Badge tone="blue">PHASE 2</Badge>
          <h2>{content.status}</h2>
          <p>This page is part of your personal training headquarters. We’re building the experience around your learning journey.</p>
          <ul className="placeholder-features">
            {content.features.map((feature) => <li key={feature}><span><Icon size={15} /></span>{feature}</li>)}
          </ul>
          <Link className="button button--secondary button--md" to="/dashboard">Back to headquarters <ArrowRight size={15} /></Link>
        </Card>
        {isProfile && (
          <div className="profile-preview-grid">
            {[
              { label: 'Experience points', value: learnerProfile.xp.toLocaleString() },
              { label: 'Training streak', value: `${learnerProfile.streak} days` },
              { label: 'Overall mastery', value: `${learnerProfile.overallMastery}%` },
              { label: 'Bugs found', value: learnerProfile.bugsFixed.toString() },
            ].map((item) => <Card className="profile-preview" key={item.label}><SectionHeader eyebrow={item.label} title={item.value} /></Card>)}
          </div>
        )}
      </PageContainer>
    </PageTransition>
  )
}
