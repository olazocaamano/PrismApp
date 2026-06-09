import { useEffect, useRef } from 'react'
import { requestNotifPermissions, scheduleReminder, cancelReminder } from '../lib/notifications'

export function useReminders(tasks) {
  const scheduled = useRef(new Set())

  useEffect(() => {
    if (!tasks || tasks.length === 0) return

    requestNotifPermissions()

    const now = Date.now()

    for (const task of tasks) {
      if (scheduled.current.has(task.id)) continue
      if (!task.reminder || task.reminderSent || task.completed) continue

      const at = task.reminder?.toDate?.()
      if (!at || at.getTime() <= now) continue

      scheduleReminder(task)
      scheduled.current.add(task.id)
    }
  }, [tasks])

  useEffect(() => {
    return () => {
      scheduled.current.clear()
    }
  }, [])
}
