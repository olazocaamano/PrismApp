import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { format, startOfWeek, addDays } from 'date-fns'
import { es, enUS, pt } from 'date-fns/locale'
import { useTasks } from '../hooks/useTasks'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'

const locales = { es, en: enUS, pt }
const COLORS = ['#4f46e5', '#f59e0b', '#ef4444', '#22c55e']

export default function Stats() {
  const { t, i18n } = useTranslation()
  const { tasks } = useTasks()
  const lang = i18n.language?.split('-')[0] || 'es'
  const locale = locales[lang] || es

  const weekDays = useMemo(() => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(weekStart, i)
      return {
        day: format(date, 'EEE', { locale }),
        date: format(date, 'yyyy-MM-dd'),
      }
    })
  }, [locale])

  const weeklyData = useMemo(() => {
    return weekDays.map(({ day, date }) => ({
      name: day,
      Completadas: tasks.filter(
        (t) => t.completed && t.dueDate?.toDate && format(t.dueDate.toDate(), 'yyyy-MM-dd') === date
      ).length,
    }))
  }, [tasks, weekDays])

  const categoryData = useMemo(() => {
    const cats = {}
    tasks.forEach((t) => {
      const cat = t.category || 'other'
      cats[cat] = (cats[cat] || 0) + 1
    })
    return Object.entries(cats).map(([name, value]) => ({ name: t(name), value }))
  }, [tasks, t])

  const priorityData = useMemo(() => {
    const counts = { low: 0, medium: 0, high: 0 }
    tasks.forEach((t) => {
      if (counts[t.priority] !== undefined) counts[t.priority]++
    })
    return Object.entries(counts).map(([name, value]) => ({ name: t(name), value }))
  }, [tasks, t])

  const completedPct = tasks.length > 0 ? Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100) : 0

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">{t('statsTitle')}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{t('completedTasks')}</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{completedPct}%</p>
          <div className="mt-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all"
              style={{ width: `${completedPct}%` }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{t('totalTasks')}</p>
          <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{tasks.length}</p>
          <p className="text-xs text-slate-400 mt-1">
            {tasks.filter((t) => t.completed).length} {t('completedTasks')} · {tasks.filter((t) => !t.completed).length} {t('pendingTasks')}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 mb-4">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">{t('thisWeek')}</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weeklyData}>
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: 'none',
                borderRadius: 8,
                color: '#f1f5f9',
                fontSize: 12,
              }}
            />
            <Bar dataKey="Completadas" fill="#4f46e5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">{t('category')}</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {categoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend fontSize={11} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">{t('priority')}</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {priorityData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend fontSize={11} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
