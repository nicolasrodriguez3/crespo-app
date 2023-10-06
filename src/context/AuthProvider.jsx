import axios from "axios"
import { authContext } from "./authContext"
import { useEffect, useState } from "react"

const API_LOGIN = import.meta.env.VITE_API_URL_LOGIN

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"))
    if (token) {
      const user = JSON.parse(localStorage.getItem("user"))
      setToken(token)
      if (user) setUser(user)
    }
    console.log(token)
  }, [])

  useEffect(() => {
    if (token) {
      getUserData(token).then((res) => {
        setUser(res)
        localStorage.setItem("user", JSON.stringify(res))
      })
    }
  }, [token])

  const signup = (email, password) => {}

  const login = async (email, password) => {
    setLoading(true)
    const credentials = {
      username: email,
      password,
    }

    const response = await axios.post(API_LOGIN, credentials)

    if (response.status === 200) {
      // guardar token en localStorage
      localStorage.setItem("token", JSON.stringify(response.data.tokenAcceso))
      setToken(response.data.tokenAcceso)
    } else if (response.status === 401) {
      throw new Error("Usuario o contraseña incorrectos")
    } else {
      throw new Error("Error en el servidor")
    }
    setLoading(false)
  }

  const logout = async () => {
    try {
      const response = await axios.get(
        "https://vps-3450851-x.dattaweb.com:9088/api/autenticacion/salir",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      if (response.status === 200) {
        setToken(null)
        // borrar token de localStorage
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        return true
      }
    } catch (error) {
      console.log(error)
      return false
    }
  }

  const resetPassword = (email) => {}

  const getUserData = async (token) => {
    try {
      const response = await axios.get(
        "https://vps-3450851-x.dattaweb.com:9088/api/usuario/mis-datos",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      if (response.status === 200) {
        return response.data
      }
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
        token,
        loading,
        signup,
        login,
        logout,
        resetPassword,
        getUserData,
      }}
    >
      {children}
    </authContext.Provider>
  )
}
