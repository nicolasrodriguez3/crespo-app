import axios from "axios"
import { authContext } from "./authContext"
import { useEffect, useState } from "react"
import { getUserData } from "../services/getUserData"

const API_URL = import.meta.env.VITE_API_URL

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const token = JSON.parse(localStorage.getItem("token"))
      setToken(token)

      getUserData(token)
        .then((res) => setUser(res))
        .catch((error) => {
          console.warn("Token inválido: ", error.response.headers.mensaje)

          setToken(null)
          localStorage.removeItem("token")
          return false
        })

      setLoading(false)
    } catch (error) {
      localStorage.removeItem("token")
      return false
    }
  }, [token])

  const signup = async ({ values }) => {
    try {
      const response = await axios.post(
        `${API_URL}/autenticacion/registrarse`,
        values,
      )

      if (response.status === 201) {
        return response.data
      }
    } catch (error) {
      console.log(error)

      if (error.response?.data?.error === "Bad credentials") {
        throw new Error("Usuario o contraseña incorrectos.")
      } else if (error.message === "Network Error") {
        throw new Error("Error de conexión. Verifique su conexión a internet.")
      } else if (error.response.status === 409) {
        throw new Error("El usuario ya existe.")
      }
      throw new Error(error.response?.data?.error)
    }
  }

  const login = async (email, password) => {
    setLoading(true)
    const credentials = {
      username: email,
      password,
    }

    try {
      const response = await axios.post(
        `${API_URL}/autenticacion/ingresar`,
        credentials,
      )

      if (response.status === 200) {
        setLoading(false)
        const token = response.data.tokenAcceso

        // guardar token en localStorage
        localStorage.setItem("token", JSON.stringify(token))
        setToken(token)
        return token
      }
    } catch (error) {
      setLoading(false)
      if (error.response?.data?.error === "Bad credentials") {
        throw new Error("Usuario o contraseña incorrectos.")
      }
      if (error.message === "Network Error") {
        throw new Error("Error de conexión. Verifique su conexión a internet.")
      }
      if (error.response.status === 404) {
        throw new Error(error.response.data.error)
      }
      throw new Error("Error en el servidor. Intente más tarde.")
    }
  }

  const logout = async () => {
    setToken(null)
    // borrar token de localStorage
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    try {
      const response = await axios.get(`${API_URL}/autenticacion/salir`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.status === 200) {
        return true
      }
    } catch (error) {
      console.log(error)
      return false
    }
  }

  // todo: const resetPassword = (email) => {}

  return (
    <authContext.Provider
      value={{
        user,
        token,
        loading,
        signup,
        login,
        logout,
      }}
    >
      {children}
    </authContext.Provider>
  )
}
