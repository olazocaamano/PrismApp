import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { HomeIcon, TasksIcon, CalendarIcon, StatsIcon, SettingsIcon, SunIcon, MoonIcon } from './Icons'

const links = [
  { to: '/', label: 'dashboard', icon: HomeIcon },
  { to: '/tasks', label: 'tasks', icon: TasksIcon },
  { to: '/calendar', label: 'calendar', icon: CalendarIcon },
  { to: '/stats', label: 'stats', icon: StatsIcon },
  { to: '/settings', label: 'settings', icon: SettingsIcon },
]

export default function Navbar() {
  const { t } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const { user } = useAuth()

  if (!user) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-800 md:top-0 md:bottom-auto">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center justify-between md:h-16">
          <NavLink to="/" className="hidden md:flex items-center gap-2 text-lg font-semibold text-indigo-600 dark:text-indigo-400">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold text-sm">P</div>
            <span>Prism</span>
          </NavLink>

          <div className="flex justify-around w-full md:w-auto md:gap-1">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex flex-col md:flex-row items-center gap-1 px-3 py-2 md:px-4 md:py-2 rounded-lg text-xs md:text-sm transition-colors ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`
                }
              >
                <Icon className="w-5 h-5 md:w-4 md:h-4" />
                <span>{t(label)}</span>
              </NavLink>
            ))}
          </div>

          <button
            onClick={toggleTheme}
            className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </nav>
  )
}
