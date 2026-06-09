import { Capacitor } from '@capacitor/core'
import { SocialLogin } from '@capgo/capacitor-social-login'
import {
  auth,
  db,
  doc,
  setDoc,
  getDoc,
  googleProvider,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithCredential,
} from './firebase'

const WEB_CLIENT_ID = import.meta.env.VITE_GOOGLE_WEB_CLIENT_ID

let initialized = false

export async function initSocialLogin() {
  if (initialized) return
  if (!WEB_CLIENT_ID) {
    console.warn('VITE_GOOGLE_WEB_CLIENT_ID no configurado')
    return
  }
  try {
    await SocialLogin.initialize({
      google: {
        webClientId: WEB_CLIENT_ID,
      },
    })
    initialized = true
  } catch (err) {
    console.warn('Error al inicializar SocialLogin:', err)
  }
}

export async function loginWithGoogleNative() {
  if (!initialized) await initSocialLogin()

  if (Capacitor.getPlatform() === 'web') {
    const result = await signInWithPopup(auth, googleProvider)
    return result.user
  }

  const { result } = await SocialLogin.login({ provider: 'google' })
  if (result.responseType !== 'online' || !result.idToken) {
    throw new Error('No se obtuvo idToken de Google')
  }

  const credential = GoogleAuthProvider.credential(result.idToken)
  const authResult = await signInWithCredential(auth, credential)
  return authResult.user
}

export async function createUserProfile(user) {
  try {
    const userRef = doc(db, 'users', user.uid)
    const userSnap = await getDoc(userRef)
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        displayName: user.displayName || '',
        email: user.email,
        createdAt: new Date().toISOString(),
        preferences: { language: 'es', theme: 'light' },
      })
    }
  } catch {
    console.warn('Firestore no disponible al crear perfil')
  }
}
