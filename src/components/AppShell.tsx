import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  Award,
  BookOpenCheck,
  Bug,
  ChartNoAxesColumnIncreasing,
  Flame,
  LayoutDashboard,
  ScrollText,
  Swords,
  Compass,
} from 'lucide-react'
import { Avatar } from './ui'
import { useLearnerStore } from '../store/useLearnerStore'
import { learnerProfile } from '../data/mockData'

const navTraining = [
  { to: '/dashboard', label: 'Investigation Board', icon: LayoutDashboard },
  { to: '/challenges', label: 'Case Files', icon: Swords },
  { to: '/practice', label: 'Targeted Practice', icon: BookOpenCheck },
  { to: '/skills', label: 'Investigation Skills', icon: ChartNoAxesColumnIncreasing },
  { to: '/bugs', label: 'Mistake Diary', icon: Bug },
]

const navJourney = [
  { to: '/achievements', label: 'Achievements', icon: Award },
  { to: '/profile', label: 'Profile', icon: ScrollText },
]

const mobileBottomNav = [
  { to: '/dashboard', label: 'BOARD', icon: LayoutDashboard },
  { to: '/challenges', label: 'CASES', icon: Swords },
  { to: '/practice', label: 'PRACTICE', icon: BookOpenCheck },
  { to: '/skills', label: 'SKILLS', icon: ChartNoAxesColumnIncreasing },
  { to: '/profile', label: 'PROFILE', icon: ScrollText },
]

const breadcrumbTitles: Record<string, string> = {
  '/dashboard': 'Investigation Board',
  '/challenges': 'Case Files',
  '/practice': 'Targeted Practice',
  '/skills': 'Investigation Skills',
  '/bugs': 'Mistake Diary',
  '/achievements': 'Achievements',
  '/profile': 'Profile',
}

export default function AppShell() {
  const name = useLearnerStore((state) => state.name) ?? learnerProfile.name
  const location = useLocation()

  const currentTitle =
    breadcrumbTitles[location.pathname] ??
    (location.pathname.startsWith('/challenge/') ? 'Challenge Workstation' : 'Training Floor')

  return (
    <div className="app-shell">
      {/* Desktop Left Sidebar (230px) */}
      <aside className="sidebar desktop-only">
        <NavLink className="brand brand--sidebar" to="/dashboard" aria-label="Debug Dojo headquarters">
          <span className="brand__mark">道</span>
          <span className="brand__text">DEBUG <b>DOJO</b></span>
        </NavLink>

        <div className="sidebar__section">
          <div className="sidebar__label">TRAINING HALL</div>
          <nav aria-label="Main navigation">
            <ul className="nav-list">
              {navTraining.map(({ to, label, icon: Icon }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
                  >
                    <Icon size={16} strokeWidth={1.8} />
                    <span>{label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="sidebar__section">
          <div className="sidebar__label">YOUR JOURNEY</div>
          <nav aria-label="Personal progress">
            <ul className="nav-list">
              {navJourney.map(({ to, label, icon: Icon }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
                  >
                    <Icon size={16} strokeWidth={1.8} />
                    <span>{label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="sidebar__footer">
          <div className="streak-indicator">
            <Flame size={15} className="text-gold" />
            <span>{learnerProfile.streak} Day Streak</span>
          </div>

          <NavLink to="/profile" className="sidebar-profile">
            <Avatar name={name} size="sm" />
            <div className="sidebar-profile__info">
              <b>{name}</b>
              <small>{learnerProfile.rank}</small>
            </div>
          </NavLink>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="shell-main">
        {/* Top Header (Desktop Breadcrumb / Mobile Logo Header) */}
        <header className="topbar">
          <div className="topbar__left">
            <NavLink className="brand brand--mobile mobile-only" to="/dashboard">
              <span className="brand__mark">道</span>
              <span className="brand__text">DEBUG <b>DOJO</b></span>
            </NavLink>
            <div className="breadcrumb desktop-only">
              <Compass size={14} />
              <span>Dojo</span>
              <span className="breadcrumb__slash">/</span>
              <b>{currentTitle}</b>
            </div>
          </div>

          <div className="topbar__right">
            <span className="topbar__status desktop-only">
              <span className="status-dot" /> Case Log 01
            </span>
            <div className="topbar__profile-pill">
              <span className="pill-xp">{learnerProfile.xp.toLocaleString()} XP</span>
              <NavLink to="/profile" aria-label={`View ${name}'s profile`}>
                <Avatar name={name} size="sm" />
              </NavLink>
            </div>
          </div>
        </header>

        {/* Viewport Content */}
        <main className="main-content">
          <Outlet />
        </main>

        <footer className="shell-footer desktop-only">
          <span>DEBUG DOJO <span className="muted">•</span> CODING DETECTIVE</span>
          <span>Find the bug. Understand the why.</span>
        </footer>
      </div>

      {/* Mobile Fixed Bottom Navigation Bar (5 Items Max) */}
      <nav className="mobile-bottom-nav mobile-only" aria-label="Mobile navigation">
        {mobileBottomNav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `mobile-nav-item ${isActive ? 'mobile-nav-item--active' : ''}`
            }
          >
            <Icon size={18} strokeWidth={1.8} />
            <span className="mobile-nav-label">{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
