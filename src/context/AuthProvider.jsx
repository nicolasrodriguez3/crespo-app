import { authContext } from "./authContext"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth"
import { doc, setDoc, Timestamp } from "firebase/firestore"

import { auth, db } from "../firebase.config"
import { useEffect } from "react"
import { useState } from "react"

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const signup = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password)

  const saveUserData = (uid, data = {}) => {
    setDoc(doc(db, "users", uid), data)
  }

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password)

  const logout = () => signOut(auth)

  const loginWithGoogle = () => {
    const googleProvider = new GoogleAuthProvider()
    return signInWithPopup(auth, googleProvider)
  }
  const loginWithFacebook = () => {
    const facebookProvider = new FacebookAuthProvider()
    return signInWithPopup(auth, facebookProvider)
  }

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email)
  }

  const saveUserImg = (avatarUrl) =>
    setUser((user) => {
      return { ...user, avatarUrl }
    })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <authContext.Provider
      value={{
        user,
        loading,
        signup,
        login,
        logout,
        loginWithGoogle,
        loginWithFacebook,
        resetPassword,
        saveUserData,
        saveUserImg,
      }}
    >
      {children}
    </authContext.Provider>
  )
}
