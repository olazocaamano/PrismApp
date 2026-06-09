import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useTasks } from '../hooks/useTasks'
import TaskCard from '../components/TaskCard'
import TaskModal from '../components/TaskModal'
import { PlusIcon, SearchIcon } from '../components/Icons'

const priorities = ['all', 'low', 'medium', 'high']
const categories = ['all', 'work', 'personal', 'study', 'health', 'other']

export default function Tasks() {
  const { t, i18n } = useTranslation()
  const { tasks, addTask, updateTask, deleteTask, toggleComplete } = useTasks()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [search, setSearch] = useState('')

  const lang = i18n.language?.split('-')[0] || 'es'

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filterStatus === 'completed' && !task.completed) return false
      if (filterStatus === 'pending' && task.completed) return false
      if (filterPriority !== 'all' && task.priority !== filterPriority) return false
      if (filterCategory !== 'all' && task.category !== filterCategory) return false
      if (search && !task.title.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [tasks, filterPriority, filterCategory, filterStatus, search])

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

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t('tasks')}</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          {t('addTask')}
        </button>
      </div>

      <div className="space-y-3 mb-4">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('search')}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400 focus:outline-none"
          >
            <option value="all">{t('all')}</option>
            <option value="pending">{t('pending')}</option>
            <option value="completed">{t('completed')}</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400 focus:outline-none"
          >
            {priorities.map((p) => (
              <option key={p} value={p}>{t(p)}</option>
            ))}
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400 focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{t(c)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        {filteredTasks.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-8 border border-slate-200 dark:border-slate-700 text-center">
            <p className="text-sm text-slate-400 dark:text-slate-500">{t('noTasks')}</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={toggleComplete}
              onEdit={handleEdit}
              onDelete={deleteTask}
              i18nLang={lang}
            />
          ))
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
