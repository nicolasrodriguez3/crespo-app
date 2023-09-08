// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
	apiKey: import.meta.env.apiKey,
	authDomain: import.meta.env.authDomain,
	projectId: import.meta.env.projectId,
	storageBucket: import.meta.env.storageBucket,
	messagingSenderId: import.meta.env.messagingSenderId,
	appId: import.meta.env.appId,
	measurementId: import.meta.env.measurementId,
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const analytics = getAnalytics(app)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
