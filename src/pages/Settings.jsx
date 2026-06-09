import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { SunIcon, MoonIcon } from '../components/Icons'

const languages = [
  { code: 'es', label: 'Español', icon: '🇪🇸' },
  { code: 'en', label: 'English', icon: '🇺🇸' },
  { code: 'pt', label: 'Português', icon: '🇧🇷' },
]

export default function Settings() {
  const { t, i18n } = useTranslation()
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()

  const currentLang = i18n.language?.split('-')[0] || 'es'

  const changeLanguage = (code) => {
    i18n.changeLanguage(code)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">{t('settings')}</h1>

      <div className="space-y-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">{t('profile')}</h2>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-medium text-sm">
              {user?.email?.charAt(0).toUpperCase() || '?'}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                {user?.displayName || user?.email}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">{t('theme')}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{t('themeDesc')}</p>
          <div className="flex gap-2">
            <button
              onClick={() => setTheme('light')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                theme === 'light'
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
                  : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <SunIcon className="w-4 h-4" />
              {t('light')}
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                theme === 'dark'
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
                  : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <MoonIcon className="w-4 h-4" />
              {t('dark')}
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">{t('language')}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{t('languageDesc')}</p>
          <div className="grid grid-cols-3 gap-2">
            {languages.map(({ code, label, icon }) => (
              <button
                key={code}
                onClick={() => changeLanguage(code)}
                className={`px-3 py-3 rounded-xl border text-sm font-medium transition-all ${
                  currentLang === code
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
                    : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <span className="block text-lg mb-1">{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full py-3 rounded-xl border border-red-200 dark:border-red-900 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          {t('logout')}
        </button>
      </div>
    </div>
  )
}
