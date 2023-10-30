import axios from "axios"
import { useState, useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import { MyTable } from "../components/MyTable"
import { WrapperUI } from "../components/WrapperUI"

const API_URL = import.meta.env.VITE_API_URL

export function UsersList() {
  const { token } = useAuth()
  const [users, setUsers] = useState([])
  const [withDeleted, setWithDeleted] = useState(false)
  const [loadData, setLoadData] = useState(false)

  useEffect(() => {
    const url = withDeleted
      ? `${API_URL}/usuario/buscar-todas-con-eliminadas`
      : `${API_URL}/usuario/buscar-todas`

    setLoadData(true)

    axios
      .get(url, {
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
        setLoadData(false)
        console.log(res)
      })
  }, [token, withDeleted])

  const showDeleted = () => {
    setWithDeleted(!withDeleted)
  }

  const handleDelete = (id) => {
    axios
      .delete(`${API_URL}/usuario/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(res)
        setUsers((prev) => prev.filter((u) => u.id !== id))
      })
      .catch((err) => console.log(err))
  }

  return (
    <WrapperUI title="Lista de usuarios">
      <h2 className="font-bold">Users List</h2>
      <MyTable
        data={users}
        loading={loadData}
        title="usuario"
        titlePlural="usuarios"
        withDeleted={showDeleted}
      />
    </WrapperUI>
  )
}
