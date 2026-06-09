import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { format, isToday, isPast, addDays, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns'
import { es, enUS, pt } from 'date-fns/locale'
import { useAuth } from '../context/AuthContext'
import { useTasks } from '../hooks/useTasks'
import { useReminders } from '../hooks/useReminders'
import TaskCard from '../components/TaskCard'
import TaskModal from '../components/TaskModal'
import { PlusIcon, AlertIcon } from '../components/Icons'

const locales = { es, en: enUS, pt }

export default function Dashboard() {
  const { t, i18n } = useTranslation()
  const { user } = useAuth()
  const { tasks, loading, addTask, updateTask, deleteTask, toggleComplete } = useTasks()
  useReminders(tasks)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  const lang = i18n.language?.split('-')[0] || 'es'
  const locale = locales[lang] || es

  const todayTasks = useMemo(
    () => tasks.filter((t) => {
      if (!t.dueDate?.toDate) return false
      const date = t.dueDate.toDate()
      return isToday(date) && !t.completed
    }),
    [tasks]
  )

  const upcomingTasks = useMemo(
    () => tasks.filter((t) => {
      if (!t.dueDate?.toDate || t.completed) return false
      const date = t.dueDate.toDate()
      const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
      const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 })
      return isWithinInterval(date, { start: weekStart, end: weekEnd }) && !isToday(date)
    }).slice(0, 5),
    [tasks]
  )

  const overdueTasks = useMemo(
    () => tasks.filter((t) => {
      if (!t.dueDate?.toDate || t.completed) return false
      return isPast(t.dueDate.toDate()) && !isToday(t.dueDate.toDate())
    }),
    [tasks]
  )

  const stats = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    pending: tasks.filter((t) => !t.completed).length,
  }), [tasks])

  const handleEdit = (task) => {
    setEditingTask(task)
    setModalOpen(true)
  }

  const handleSave = (taskData) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData)
    } else {
      addTask(taskData)
    }
    setEditingTask(null)
  }

  const handleClose = () => {
    setModalOpen(false)
    setEditingTask(null)
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-[3px] border-indigo-500 border-t-transparent" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            {t('dashboard')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {format(new Date(), "EEEE, d 'de' MMMM", { locale })}
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition-colors shadow-sm"
        >
          <PlusIcon className="w-4 h-4" />
          {t('addTask')}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400">{t('totalTasks')}</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400">{t('completedTasks')}</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400">{t('pendingTasks')}</p>
          <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{stats.pending}</p>
        </div>
      </div>

      {overdueTasks.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-3 flex items-center gap-2">
            <AlertIcon className="w-4 h-4" /> {overdueTasks.length} {t('pendingTasks')}
          </h2>
          <div className="space-y-2">
            {overdueTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={toggleComplete}
                onEdit={handleEdit}
                onDelete={deleteTask}
                i18nLang={lang}
              />
            ))}
          </div>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">{t('today')}</h2>
        {todayTasks.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 text-center">
            <p className="text-sm text-slate-400 dark:text-slate-500">{t('noTasksDay')}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {todayTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={toggleComplete}
                onEdit={handleEdit}
                onDelete={deleteTask}
                i18nLang={lang}
              />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">{t('thisWeek')}</h2>
        {upcomingTasks.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 text-center">
            <p className="text-sm text-slate-400 dark:text-slate-500">{t('noTasks')}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {upcomingTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={toggleComplete}
                onEdit={handleEdit}
                onDelete={deleteTask}
                i18nLang={lang}
              />
            ))}
          </div>
        )}
      </div>

      <TaskModal
        isOpen={modalOpen}
        onClose={handleClose}
        onSave={handleSave}
        task={editingTask}
      />
    </div>
  )
}
