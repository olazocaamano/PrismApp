import { createContext, useContext, useEffect, useState } from 'react'
import {
  auth,
  signInWithPopup,
  googleProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setDoc,
  getDoc,
  doc,
  db,
} from '../lib/firebase'
import { Capacitor } from '@capacitor/core'
import { loginWithGoogleNative, initSocialLogin, createUserProfile } from '../lib/socialLogin'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      if (Capacitor.getPlatform() !== 'web') {
        await initSocialLogin()
      }
    }
    init()

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return result
  }

  const register = async (email, password, displayName) => {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    try {
      await setDoc(doc(db, 'users', result.user.uid), {
        displayName,
        email,
        createdAt: new Date().toISOString(),
        preferences: { language: 'es', theme: 'light' },
      })
    } catch {
      console.warn('Firestore no disponible, usuario autenticado igualmente')
    }
    return result
  }

  const loginWithGoogle = async () => {
    let result
    if (Capacitor.getPlatform() === 'web') {
      result = await signInWithPopup(auth, googleProvider)
    } else {
      result = await loginWithGoogleNative()
    }
    await createUserProfile(result)
    return result
  }

  const logout = () => signOut(auth)

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
