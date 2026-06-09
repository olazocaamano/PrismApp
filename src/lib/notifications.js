import { LocalNotifications } from '@capacitor/local-notifications'
import { Capacitor } from '@capacitor/core'

function hashId(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

export function isNative() {
  return Capacitor.getPlatform() === 'android'
}

export async function requestNotifPermissions() {
  if (!isNative()) return true
  try {
    const { display } = await LocalNotifications.requestPermissions()
    return display === 'granted'
  } catch {
    return false
  }
}

export async function scheduleReminder(task) {
  if (!isNative()) return
  try {
    const at = task.reminder?.toDate?.()
    if (!at || at.getTime() <= Date.now()) return

    await LocalNotifications.schedule({
      notifications: [{
        title: task.title,
        body: task.description || 'Tienes una tarea por vencer',
        id: hashId(task.id),
        schedule: { at },
        extra: { taskId: task.id },
      }],
    })
  } catch (err) {
    console.warn('Notif error:', err.message)
  }
}

export async function cancelReminder(taskId) {
  if (!isNative()) return
  try {
    await LocalNotifications.cancel({ notifications: [{ id: hashId(taskId) }] })
  } catch (err) {
    console.warn('Cancel notif error:', err.message)
  }
}

export async function cancelAllReminders() {
  if (!isNative()) return
  try {
    await LocalNotifications.cancelAll()
  } catch (err) {
    console.warn('Cancel all notif error:', err.message)
  }
}
