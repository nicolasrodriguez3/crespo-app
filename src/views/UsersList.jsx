import axios from "axios"
import { useState, useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import { MyTable } from "./MyTable"

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
        //parsear data
        const dataParsed = res.data.map((u) => {
          return {
            id: u.id,
            data: u.nombre,
          }
        })
        setUsers(dataParsed)
				console.log(res)
      })
  }, [token])

  return (
    <>
      <h2 className="font-bold">Users List</h2>
      <MyTable data={users} theme="usuario"/>
    </>
  )
}
