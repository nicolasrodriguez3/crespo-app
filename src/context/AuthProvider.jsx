import { authContext } from "./authContext"
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	onAuthStateChanged,
	signOut,
	GoogleAuthProvider,
	FacebookAuthProvider,
	signInWithPopup,
	sendPasswordResetEmail
} from "firebase/auth"
import { auth } from "../firebase.config"
import { useEffect } from "react"
import { useState } from "react"

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null)

	const signup = (email, password) => createUserWithEmailAndPassword(auth, email, password)

	const login = (email, password) => signInWithEmailAndPassword(auth, email, password)

	const logout = () => signOut(auth)

	const loginWithGoogle = () => {
		const googleProvider = new GoogleAuthProvider()
		return signInWithPopup(auth, googleProvider)
	}
	const loginWithFacebook = () => {
		const facebookProvider = new FacebookAuthProvider()
		return signInWithPopup(auth, facebookProvider);
	}

	const resetPassword = (email) => {
		return sendPasswordResetEmail(auth, email)
	}

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			if(currentUser){
			setUser(currentUser)
			} else {
				setUser(null)
			}
		})

		return () => unsubscribe()
	}, [])

	return (
		<authContext.Provider value={{ user, signup, login, logout, loginWithGoogle, loginWithFacebook, resetPassword }}>
			{children}
		</authContext.Provider>
	)
}
