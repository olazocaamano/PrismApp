const functions = require('firebase-functions')
const admin = require('firebase-admin')
const nodemailer = require('nodemailer')

admin.initializeApp()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().gmail.email,
    pass: functions.config().gmail.password,
  },
})

exports.sendTaskReminders = functions.pubsub
  .schedule('*/30 * * * *')
  .timeZone('America/Mexico_City')
  .onRun(async () => {
    const now = admin.firestore.Timestamp.now()
    const inOneHour = new Date(now.toMillis() + 60 * 60 * 1000)

    const usersSnapshot = await admin.firestore().collection('users').get()

    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id
      const userData = userDoc.data()

      const tasksSnapshot = await admin
        .firestore()
        .collection('users')
        .doc(userId)
        .collection('tasks')
        .where('completed', '==', false)
        .where('reminder', '!=', null)
        .get()

      for (const taskDoc of tasksSnapshot.docs) {
        const task = taskDoc.data()
        const reminderDate = task.reminder?.toDate

        if (!reminderDate) continue

        const reminderTime = reminderDate.getTime()
        const nowTime = now.toMillis()

        if (reminderTime > nowTime && reminderTime <= inOneHour.getTime()) {
          const mailOptions = {
            from: `"Prism" <${functions.config().gmail.email}>`,
            to: userData.email,
            subject: `🔔 Recordatorio: ${task.title}`,
            html: `
              <div style="font-family: 'Inter', sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background: #f8fafc; border-radius: 12px;">
                <div style="text-align: center; margin-bottom: 20px;">
                  <span style="font-size: 32px;">◇</span>
                  <h1 style="font-size: 20px; color: #1e293b; margin: 4px 0 0;">Prism</h1>
                </div>
                <div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0;">
                  <h2 style="font-size: 16px; color: #4f46e5; margin: 0 0 12px;">🔔 Recordatorio de tarea</h2>
                  <p style="font-size: 14px; color: #1e293b; margin: 0 0 8px;">
                    <strong>${task.title}</strong>
                  </p>
                  ${task.description ? `<p style="font-size: 13px; color: #64748b; margin: 0 0 12px;">${task.description}</p>` : ''}
                  <div style="display: flex; gap: 8px; font-size: 12px;">
                    <span style="padding: 4px 10px; border-radius: 999px; background: #eef2ff; color: #4f46e5;">
                      ${task.priority || 'media'}
                    </span>
                    <span style="padding: 4px 10px; border-radius: 999px; background: #f1f5f9; color: #64748b;">
                      ${task.category || 'otra'}
                    </span>
                  </div>
                </div>
                <p style="text-align: center; font-size: 12px; color: #94a3b8; margin-top: 16px;">
                  Prism — Tu gestor de tareas personal
                </p>
              </div>
            `,
          }

          try {
            await transporter.sendMail(mailOptions)
            functions.logger.info(`Reminder sent for task: ${task.title} to ${userData.email}`)
          } catch (error) {
            functions.logger.error(`Error sending reminder: ${error.message}`)
          }
        }
      }
    }
  })
