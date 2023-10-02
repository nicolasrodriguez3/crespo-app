import { authContext } from "./authContext"
import { useEffect, useState } from "react"

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const signup = (email, password) => {}

  const login = (email, password) => {}

  const logout = () => {}

  const resetPassword = (email) => {}

  const getUserData = async (uid) => {
    try {
      console.log(uid)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    setLoading(false)
  }, [])

  return (
    <authContext.Provider
      value={{
        user,
        loading,
        signup,
        login,
        logout,
        resetPassword,
      }}
    >
      {children}
    </authContext.Provider>
  )
}
