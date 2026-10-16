import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'motion/react'
import AppShell from './components/AppShell'
import DashboardPage from './pages/DashboardPage'
import LandingPage from './pages/LandingPage'
import OnboardingPage from './pages/OnboardingPage'
import ChallengePage from './pages/ChallengePage'
import ChallengesListPage from './pages/ChallengesListPage'
import PracticePage from './pages/PracticePage'
import SkillsPage from './pages/SkillsPage'
import BugDiaryPage from './pages/BugDiaryPage'
import AchievementsPage from './pages/AchievementsPage'
import ProfilePage from './pages/ProfilePage'

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/challenges" element={<ChallengesListPage />} />
          <Route path="/challenge/:challengeId" element={<ChallengePage />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/bugs" element={<BugDiaryPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  )
}

export default App
