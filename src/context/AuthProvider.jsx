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
    const token = JSON.parse(localStorage.getItem("token"))
    if (token) {
      setToken(token)

      getUserData(token)
        .then((res) => {
          if (res.status) {
            // si res.status es true, el token es inválido
            console.warn("Token inválido")

            setToken(null)
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            return false
          }

          setUser(res)
          localStorage.setItem("user", JSON.stringify(res))
        })
        .catch((error) => {
          console.log(error)
        })
    }
    setLoading(false)
  }, [])

  const signup = async ({ values }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/autenticacion/registrarse`,
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
      }else if(error.response.status === 409){
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
        `${API_URL}/api/autenticacion/ingresar`,
        credentials,
      )

      if (response.status === 200) {
        // guardar token en localStorage
        setLoading(false)
        localStorage.setItem("token", JSON.stringify(response.data.tokenAcceso))
        setToken(response.data.tokenAcceso)
        return response.data.tokenAcceso
      }
    } catch (error) {
      setLoading(false)
      if (error.response?.data?.error === "Bad credentials") {
        throw new Error("Usuario o contraseña incorrectos.")
      } else if (error.message === "Network Error") {
        throw new Error("Error de conexión. Verifique su conexión a internet.")
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
      const response = await axios.get(
        "https://vps-3450851-x.dattaweb.com:9088/api/autenticacion/salir",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
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
