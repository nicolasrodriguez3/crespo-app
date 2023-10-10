import axios from "axios"
import { authContext } from "./authContext"
import { useEffect, useState } from "react"

const API_LOGIN = import.meta.env.VITE_API_URL_LOGIN
const API_URL = import.meta.env.VITE_API_URL

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("Auth provider...")
    const token = JSON.parse(localStorage.getItem("token"))
    if (token) {
      setToken(token)
      getUserData(token).then((res) => {
        setUser(res)
        localStorage.setItem("user", JSON.stringify(res))
      })
    }
    setLoading(false)
  }, [])

  const signup = async ({values}) => {
    setLoading(true)

    try {
      const response = await axios.post(`${API_URL}/api/autenticacion/registrarse`, values)

      if (response.status === 201) {
        setLoading(false)
        return response.data
      }
    } catch (error) {
      setLoading(false)
      console.log(error)
      if (error?.response?.data?.error === "Bad credentials") {
        throw new Error("Usuario o contraseña incorrectos.")
      } else if (error.message === "Network Error") {
        throw new Error("Error de conexión. Verifique su conexión a internet.")
      }
      throw new Error("Error en el servidor. Intente más tarde.")
    }

  }

  const login = async (email, password) => {
    setLoading(true)
    const credentials = {
      username: email,
      password,
    }

    try {
      const response = await axios.post(API_LOGIN, credentials)

      if (response.status === 200) {
        // guardar token en localStorage
        setLoading(false)
        localStorage.setItem("token", JSON.stringify(response.data.tokenAcceso))
        setToken(response.data.tokenAcceso)
        return response.data.tokenAcceso
      }
    } catch (error) {
      setLoading(false)
      if (error?.response?.data?.error === "Bad credentials") {
        throw new Error("Usuario o contraseña incorrectos.")
      } else if (error.message === "Network Error") {
        throw new Error("Error de conexión. Verifique su conexión a internet.")
      }
      throw new Error("Error en el servidor. Intente más tarde.")
    }
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
    console.log("Getting user data...", token)
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
