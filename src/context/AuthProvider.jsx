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
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore"

import { auth, db } from "../firebase.config"
import { useEffect } from "react"
import { useState } from "react"
import { getProfileImage } from "../helpers/getProfileImage"

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

  const getUserImg = async (id) => {
    const userImg = await getProfileImage(id)
    setUser((user) => {
      return { ...user, userImg }
    })
  }

  const getUserData = async (uid) => {
    try {
      const docRef = doc(db, "users", uid)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        return docSnap.data()
      } else {
        throw new Error("No se encontró el usuario")
      }
    } catch (error) {
      throw new Error(error)
    }
  }
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const { uid } = currentUser

        const userData = getUserData(uid)
        const user = {
          ...currentUser,
          ...userData,
        }

        setUser(user)
        getUserImg(uid)
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
        getUserImg,
      }}
    >
      {children}
    </authContext.Provider>
  )
}
