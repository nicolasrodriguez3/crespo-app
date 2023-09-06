import { useState, useEffect } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase.config"

function useGetUserData(uid) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const getUserData = async () => {
      try {
        const docRef = doc(db, "users", uid)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data())
          setData(docSnap.data())
        } else {
          // docSnap.data() will be undefined in this case
          console.log("No such document!")
        }
      } catch (error) {
        setError(error)
      } finally {
        setLoading(false)
      }
    }

    getUserData()
    return () => {}
  }, [uid])

  return [data, loading, error]
}

export default useGetUserData
