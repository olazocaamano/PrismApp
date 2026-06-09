import { useEffect, useRef } from 'react'
import { db, updateDoc, doc } from '../lib/firebase'
import { useAuth } from '../context/AuthContext'
import { sendReminderEmail } from '../lib/emailjs'
import { useTranslation } from 'react-i18next'

export function useReminders(tasks) {
  const { user } = useAuth()
  const { t } = useTranslation()
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!user || !tasks || tasks.length === 0) return

    const checkReminders = async () => {
      const now = Date.now()

      for (const task of tasks) {
        if (
          !task.reminder ||
          task.reminderSent ||
          task.completed
        ) continue

        const reminderTime = task.reminder?.toDate?.()?.getTime()
        if (!reminderTime || reminderTime > now) continue

        const ok = await sendReminderEmail({
          task,
          userEmail: user.email,
          userName: user.displayName,
          t,
        })

        if (ok) {
          try {
            await updateDoc(doc(db, 'users', user.uid, 'tasks', task.id), {
              reminderSent: true,
            })
          } catch (err) {
            console.warn('Error al marcar recordatorio enviado:', err)
          }
        }
      }
    }

    checkReminders()
    intervalRef.current = setInterval(checkReminders, 60_000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [user, tasks])
}
