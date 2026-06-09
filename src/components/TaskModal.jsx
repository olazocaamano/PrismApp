import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { v4 as uuidv4 } from 'uuid'
import { CloseIcon } from './Icons'

const priorities = ['low', 'medium', 'high']
const categories = ['work', 'personal', 'study', 'health', 'other']
const recurringOptions = ['none', 'daily', 'weekly', 'monthly']

const emptyTask = {
  title: '',
  description: '',
  dueDate: '',
  priority: 'medium',
  category: 'work',
  subtasks: [],
  recurring: 'none',
  reminder: null,
  reminderMinutes: 30,
}

export default function TaskModal({ isOpen, onClose, onSave, task }) {
  const { t } = useTranslation()
  const [form, setForm] = useState(emptyTask)
  const [subtaskInput, setSubtaskInput] = useState('')

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        dueDate: task.dueDate?.toDate ? task.dueDate.toDate().toISOString().split('T')[0] : '',
        priority: task.priority || 'medium',
        category: task.category || 'work',
        subtasks: task.subtasks || [],
        recurring: task.recurring || 'none',
        reminder: task.reminder || null,
        reminderMinutes: task.reminderMinutes || 30,
      })
    } else {
      setForm(emptyTask)
    }
    setSubtaskInput('')
  }, [task, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    onSave({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      dueDate: form.dueDate || null,
      reminder: form.reminder || null,
    })
    onClose()
  }

  const addSubtask = () => {
    if (!subtaskInput.trim()) return
    setForm((prev) => ({
      ...prev,
      subtasks: [...prev.subtasks, { id: uuidv4(), title: subtaskInput.trim(), completed: false }],
    }))
    setSubtaskInput('')
  }

  const removeSubtask = (id) => {
    setForm((prev) => ({
      ...prev,
      subtasks: prev.subtasks.filter((st) => st.id !== id),
    }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-800 rounded-t-2xl md:rounded-2xl w-full max-w-lg max-h-[90dvh] overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-white dark:bg-slate-800 px-6 pt-6 pb-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              {task ? t('editTask') : t('addTask')}
            </h2>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{t('title')}</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder={t('title')}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{t('description')}</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              placeholder={t('description')}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{t('dueDate')}</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{t('priority')}</label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {priorities.map((p) => (
                  <option key={p} value={p}>{t(p)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{t('category')}</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{t(c)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{t('recurring')}</label>
              <select
                value={form.recurring}
                onChange={(e) => setForm({ ...form, recurring: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {recurringOptions.map((r) => (
                  <option key={r} value={r}>{t(r)}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{t('subtasks')}</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={subtaskInput}
                onChange={(e) => setSubtaskInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder={t('addSubtask')}
              />
              <button
                type="button"
                onClick={addSubtask}
                className="px-3 py-2 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600 transition-colors"
              >
                +
              </button>
            </div>
            {form.subtasks.map((st) => (
              <div key={st.id} className="flex items-center justify-between py-1 px-2 rounded bg-slate-50 dark:bg-slate-700/50 mb-1">
                <span className="text-sm text-slate-700 dark:text-slate-300">{st.title}</span>
                <button type="button" onClick={() => removeSubtask(st.id)} className="text-red-400 hover:text-red-500 text-xs">
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition-colors"
          >
            {task ? t('editTask') : t('addTask')}
          </button>
        </form>
      </div>
    </div>
  )
}
