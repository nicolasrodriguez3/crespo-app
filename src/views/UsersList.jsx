import axios from "axios"
import { useState, useEffect } from "react"
import { useAuth } from "../hooks/useAuth"

const API_URL = import.meta.env.VITE_API_URL

export function UsersList() {
  const { token } = useAuth()
  const [users, setUsers] = useState([])

  useEffect(() => {
    axios
      .get(`${API_URL}/usuario/buscar-todas`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUsers(res.data)
				console.log(res)
      })
  }, [token])

  return (
    <div>
      <h1 className="font-bold">Users List</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.nombre}</li>
        ))}
      </ul>
    </div>
  )
}
