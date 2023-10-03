import axios from "axios"
import { authContext } from "./authContext"
import { useEffect, useState } from "react"

const API_LOGIN = import.meta.env.VITE_API_URL_LOGIN

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))

    if (user) setUser(user)
    console.log(user)
  }, [])

  const signup = (email, password) => {}

  const login = async (email, password) => {
    const credentials = {
      username: email,
      password,
    }

    try {
      const res = await axios.post(API_LOGIN, credentials)
      console.log(res.data)

      if (res.status === 200) {
        const dataParsed = {
          token: res.data.tokenAcceso,
          roles: res.data.roles,
        }

        localStorage.setItem("user", JSON.stringify(dataParsed))

        setUser(dataParsed)
        console.log(dataParsed)
        return dataParsed
      } else {
        console.error(
          "Inicio de sesión fallido. Código de respuesta:",
          res.status,
        )
      }
    } catch (error) {
      if (error.response) {
        // Si la respuesta contiene un estado HTTP no exitoso (por ejemplo, 404 o 500)
        console.error(
          "Error en la respuesta:",
          error.response.status,
          error.response.statusText,
        )
      } else if (error.request) {
        // Si la solicitud no pudo ser realizada (por ejemplo, el servidor no respondió)
        console.error("Error en la solicitud:", error)
      } else {
        // Otros errores
        console.error("Error:", error.message)
      }
    }
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
