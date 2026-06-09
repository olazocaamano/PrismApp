import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es'
import enLocale from '@fullcalendar/core/locales/en-gb'
import ptLocale from '@fullcalendar/core/locales/pt-br'
import { useTasks } from '../hooks/useTasks'
import TaskModal from '../components/TaskModal'
import { PlusIcon } from '../components/Icons'

const calendarLocales = { es: esLocale, en: enLocale, pt: ptLocale }

const colorMap = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#6366f1',
}

export default function Calendar() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.split('-')[0] || 'es'
  const { tasks, loading, addTask, updateTask, deleteTask } = useTasks()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)

  const events = useMemo(
    () =>
      tasks
        .filter((t) => t.dueDate?.toDate)
        .map((t) => ({
          id: t.id,
          title: t.title,
          start: t.dueDate.toDate().toISOString().split('T')[0],
          allDay: true,
          classNames: ['prism-event', t.completed ? 'fc-event-completed' : ''].filter(Boolean),
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          textColor: t.completed ? '#22c55e' : colorMap[t.priority] || '#6366f1',
          extendedProps: { task: t, completed: t.completed, priority: t.priority },
        })),
    [tasks]
  )

  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr)
    setEditingTask(null)
    setModalOpen(true)
  }

  const handleEventClick = (info) => {
    setEditingTask(info.event.extendedProps.task)
    setSelectedDate(null)
    setModalOpen(true)
  }

  const handleSave = (taskData) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData)
    } else {
      addTask({ ...taskData, dueDate: selectedDate || taskData.dueDate })
    }
    setEditingTask(null)
    setSelectedDate(null)
  }

  const handleClose = () => {
    setModalOpen(false)
    setEditingTask(null)
    setSelectedDate(null)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t('calendar')}</h1>
        <button
          onClick={() => { setSelectedDate(null); setEditingTask(null); setModalOpen(true) }}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 text-white rounded-xl text-sm font-medium hover:bg-indigo-600 active:bg-indigo-700 transition-colors shadow-sm"
        >
          <PlusIcon className="w-4 h-4" />
          {t('addTask')}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-[3px] border-indigo-500 border-t-transparent" />
        </div>
      ) : (
        <>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            height="auto"
            locale={calendarLocales[lang] || esLocale}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: '',
            }}
            buttonText={{ today: t('today') }}
            dayMaxEvents={3}
            eventDisplay="block"
            eventTimeDisplay={false}
          />
        </>
      )}

      <div className="mt-3 flex items-center gap-4 justify-end text-[11px] text-slate-400 dark:text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-indigo-500" />
          {t('low')}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          {t('medium')}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          {t('high')}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          {t('completed')}
        </span>
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
