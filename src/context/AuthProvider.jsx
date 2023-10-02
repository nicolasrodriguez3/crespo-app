import { authContext } from "./authContext"
import { useEffect, useState } from "react"

const API_LOGIN = import.meta.env.VITE_API_URL_LOGIN

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const signup = (email, password) => {}

  const login = async (email, password) => {
    const credentials = {
      username: email,
      password,
    }

    const res = await fetch(API_LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
    console.log(res)
    //if (!res.ok) return Promise.reject("Error en la petición HTTP")

    const data = await res.json()
    return data
  }

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
