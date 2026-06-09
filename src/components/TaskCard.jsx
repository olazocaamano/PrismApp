import { useTranslation } from 'react-i18next'
import { format, isPast, isToday } from 'date-fns'
import { es, enUS, pt } from 'date-fns/locale'
import { CalendarIcon, EditIcon, TrashIcon, CheckIcon } from './Icons'

const locales = { es, en: enUS, pt }

const priorityColors = {
  low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

export default function TaskCard({ task, onToggle, onEdit, onDelete, i18nLang }) {
  const { t } = useTranslation()

  const dueDate = task.dueDate?.toDate ? task.dueDate.toDate() : null
  const overdue = dueDate && isPast(dueDate) && !task.completed
  const isDueToday = dueDate && isToday(dueDate) && !task.completed

  return (
    <div
      className={`group relative bg-white dark:bg-slate-800 rounded-xl border transition-all ${
        task.completed
          ? 'border-slate-200 dark:border-slate-700 opacity-70'
          : overdue
            ? 'border-red-300 dark:border-red-800 shadow-sm shadow-red-100 dark:shadow-red-900/20'
            : 'border-slate-200 dark:border-slate-700 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600'
      }`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <button
            onClick={() => onToggle(task.id, task.completed)}
            className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 transition-colors ${
              task.completed
                ? 'bg-primary-500 border-primary-500 dark:bg-primary-400 dark:border-primary-400'
                : 'border-slate-300 dark:border-slate-600 hover:border-primary-400'
            }`}
          >
            {task.completed && <CheckIcon className="w-full h-full text-white" />}
          </button>

          <div className="flex-1 min-w-0">
            <h3
              className={`font-medium text-sm truncate ${
                task.completed
                  ? 'line-through text-slate-400 dark:text-slate-500'
                  : 'text-slate-800 dark:text-slate-100'
              }`}
            >
              {task.title}
            </h3>

            {task.description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                {task.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${priorityColors[task.priority] || priorityColors.medium}`}>
                {t(task.priority || 'medium')}
              </span>

              {task.category && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                  {t(task.category)}
                </span>
              )}

              {dueDate && (
                <span
                  className={`text-[10px] flex items-center gap-1 ${
                    overdue ? 'text-red-600 dark:text-red-400 font-medium' : isDueToday ? 'text-primary-600 dark:text-primary-400 font-medium' : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  <CalendarIcon className="w-3 h-3" />
                  {format(dueDate, 'd MMM', { locale: locales[i18nLang] || es })}
                  {overdue && <span className="text-red-500">• {t('pending')}</span>}
                </span>
              )}
            </div>

            {task.subtasks?.length > 0 && (
              <div className="mt-2 space-y-1">
                {task.subtasks.map((st) => (
                  <div key={st.id} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className={st.completed ? 'text-green-500' : 'text-slate-300 dark:text-slate-600'}>
                      {st.completed ? '✓' : '○'}
                    </span>
                    <span className={st.completed ? 'line-through' : ''}>{st.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 active:bg-indigo-50 dark:active:bg-indigo-900/20 transition-colors"
            >
              <EditIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 active:bg-red-50 dark:active:bg-red-900/20 transition-colors"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
