import { useState, useEffect } from 'react'
import {
  db,
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from '../lib/firebase'
import { useAuth } from '../context/AuthContext'
import { scheduleReminder, cancelReminder } from '../lib/notifications'

export function useTasks() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) {
      setTasks([])
      setLoading(false)
      return
    }

    const tasksRef = collection(db, 'users', user.uid, 'tasks')
    const q = query(tasksRef, orderBy('createdAt', 'desc'))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const taskList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setTasks(taskList)
        setLoading(false)
      },
      (err) => {
        console.warn('Error al cargar tareas:', err.message)
        setError(err.message)
        setLoading(false)
      }
    )

    return unsubscribe
  }, [user])

  const addTask = async (taskData) => {
    if (!user) return
    try {
      const taskRef = doc(collection(db, 'users', user.uid, 'tasks'))
      const reminder = taskData.reminder
        ? Timestamp.fromDate(new Date(taskData.reminder))
        : null
      await setDoc(taskRef, {
        ...taskData,
        completed: false,
        subtasks: taskData.subtasks || [],
        createdAt: serverTimestamp(),
        dueDate: taskData.dueDate ? Timestamp.fromDate(new Date(taskData.dueDate)) : null,
        reminder,
        reminderSent: false,
        recurring: taskData.recurring || 'none',
      })
      if (reminder) {
        scheduleReminder({ id: taskRef.id, title: taskData.title, description: taskData.description, reminder })
      }
    } catch (err) {
      console.warn('Error al crear tarea:', err.message)
    }
  }

  const updateTask = async (taskId, taskData) => {
    if (!user) return
    try {
      const oldTask = tasks.find((t) => t.id === taskId)
      const taskRef = doc(db, 'users', user.uid, 'tasks', taskId)
      const data = { ...taskData }
      if (data.dueDate) {
        data.dueDate = Timestamp.fromDate(new Date(data.dueDate))
      } else if (data.dueDate === null) {
        data.dueDate = null
      }
      if (data.reminder) {
        data.reminder = Timestamp.fromDate(new Date(data.reminder))
        data.reminderSent = false
      } else if (data.reminder === null) {
        data.reminder = null
      }
      await updateDoc(taskRef, data)

      const newReminder = data.reminder
      const hadReminder = oldTask?.reminder
      if (hadReminder && (!newReminder || oldTask.id !== taskId)) {
        cancelReminder(taskId)
      }
      if (newReminder) {
        scheduleReminder({
          id: taskId,
          title: data.title || oldTask?.title || '',
          description: data.description !== undefined ? data.description : oldTask?.description || '',
          reminder: newReminder,
        })
      }
    } catch (err) {
      console.warn('Error al actualizar tarea:', err.message)
    }
  }

  const deleteTask = async (taskId) => {
    if (!user) return
    try {
      cancelReminder(taskId)
      await deleteDoc(doc(db, 'users', user.uid, 'tasks', taskId))
    } catch (err) {
      console.warn('Error al eliminar tarea:', err.message)
    }
  }

  const toggleComplete = async (taskId, currentStatus) => {
    await updateTask(taskId, { completed: !currentStatus })
  }

  const addSubtask = async (taskId, subtask) => {
    if (!user) return
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return
    const subtasks = [...(task.subtasks || []), subtask]
    await updateDoc(doc(db, 'users', user.uid, 'tasks', taskId), { subtasks })
  }

  const toggleSubtask = async (taskId, subtaskId) => {
    if (!user) return
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return
    const subtasks = task.subtasks.map((st) =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    )
    await updateDoc(doc(db, 'users', user.uid, 'tasks', taskId), { subtasks })
  }

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    addSubtask,
    toggleSubtask,
  }
}
