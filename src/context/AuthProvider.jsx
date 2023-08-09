import { authContext } from './authContext'
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase.config";


export function AuthProvider({ children }) {

	const signup = (email, password) => 
		createUserWithEmailAndPassword(auth, email, password)

	return <authContext.Provider value={{ signup }}>{children}</authContext.Provider>
}
