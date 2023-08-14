// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
	apiKey: "AIzaSyDbi5WBIX3lGwd5qUyCn4S_SfLJkQOxHrA",
	authDomain: "crespo-app.firebaseapp.com",
	projectId: "crespo-app",
	storageBucket: "crespo-app.appspot.com",
	messagingSenderId: "158683685873",
	appId: "1:158683685873:web:5ebb6cd5895f5bada19a50",
	measurementId: "G-GVF57GBTXS",
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const analytics = getAnalytics(app)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
