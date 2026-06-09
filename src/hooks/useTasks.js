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
      await setDoc(taskRef, {
        ...taskData,
        completed: false,
        subtasks: taskData.subtasks || [],
        createdAt: serverTimestamp(),
        dueDate: taskData.dueDate ? Timestamp.fromDate(new Date(taskData.dueDate)) : null,
        reminder: taskData.reminder || null,
        recurring: taskData.recurring || 'none',
      })
    } catch (err) {
      console.warn('Error al crear tarea:', err.message)
    }
  }

  const updateTask = async (taskId, taskData) => {
    if (!user) return
    try {
      const taskRef = doc(db, 'users', user.uid, 'tasks', taskId)
      const data = { ...taskData }
      if (data.dueDate) {
        data.dueDate = Timestamp.fromDate(new Date(data.dueDate))
      } else if (data.dueDate === null) {
        data.dueDate = null
      }
      await updateDoc(taskRef, data)
    } catch (err) {
      console.warn('Error al actualizar tarea:', err.message)
    }
  }

  const deleteTask = async (taskId) => {
    if (!user) return
    try {
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
