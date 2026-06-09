import emailjs from '@emailjs/browser'

const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID

let initialized = false

export function initEmailJS() {
  if (!initialized && PUBLIC_KEY) {
    emailjs.init(PUBLIC_KEY)
    initialized = true
  }
}

export async function sendReminderEmail({ task, userEmail, userName, t }) {
  if (!PUBLIC_KEY || !SERVICE_ID || !TEMPLATE_ID) {
    console.warn('EmailJS no configurado — faltan credenciales en .env')
    return false
  }

  const dueDateStr = task.dueDate?.toDate
    ? task.dueDate.toDate().toLocaleDateString()
    : '—'

  const priorityLabels = { low: t('low'), medium: t('medium'), high: t('high') }

  try {
    initEmailJS()
    const result = await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
      to_name: userName || 'Usuario',
      to_email: userEmail,
      task_title: task.title,
      task_description: task.description || '',
      due_date: dueDateStr,
      priority: priorityLabels[task.priority] || task.priority,
      category: task.category || '',
      app_name: 'Prism',
    })
    console.log('Recordatorio enviado:', result.status, result.text)
    return true
  } catch (err) {
    console.warn('Error al enviar recordatorio:', err)
    return false
  }
}
