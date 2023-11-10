import axios from "axios"
import { useState, useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import { MyTable } from "../components/MyTable"
import { WrapperUI } from "../components/WrapperUI"
import toast from "react-hot-toast"

const API_URL = import.meta.env.VITE_API_URL

export function UsersList() {
  const { token } = useAuth()
  const [users, setUsers] = useState([])
  const [withDeleted, setWithDeleted] = useState(false)
  const [loadData, setLoadData] = useState(false)

  useEffect(() => {
    if (withDeleted) return
    setLoadData(true)

    axios
      .get(`${API_URL}/usuario/buscar-todas`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        //parsear data
        const dataParsed = res.data.map((user) => {
          return {
            id: user.id,
            data: user.nombre,
            ...user,
          }
        })

        setUsers(dataParsed)
        setLoadData(false)
        console.log(res)
      }).catch(err => {
        console.log(err)
        toast.error("Error al cargar usuarios")
      })
  }, [token, withDeleted])

  useEffect(() => {
    if (!withDeleted) return
    setLoadData(true)

    axios
      .get(`${API_URL}/usuario/buscar-todas-con-eliminadas`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const idsActive = users.map((user) => user.id)
        const deletedUsers = res.data.map((user) => {
          return {
            deleted: !idsActive.includes(user.id),
            id: user.id,
            data: user.nombre,
            ...user,
          }
        })

        setUsers(deletedUsers)
        setLoadData(false)
      }).catch(err => {
        console.log(err)
        toast.error("Error al cargar usuarios")
        setLoadData(false)
      })
  }, [token, users, withDeleted])

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
        if (!withDeleted) {
          setUsers((prev) => prev.filter((u) => u.id !== id))
        } else {
          setUsers((prev) =>
            prev.map((u) => {
              if (u.id === id) {
                return { ...u, deleted: true }
              }
              return u
            }),
          )
        }
        toast.success("Usuario eliminado")
      })
      .catch((err) => {
        console.log(err)
        toast.error("Error al eliminar usuario")
      })
  }

  const handleRestore = (id) => {
    axios
      .post(
        `${API_URL}/usuario/reciclar/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((res) => {
        console.log(res)
        setUsers((prev) =>
          prev.map((u) => {
            if (u.id === id) {
              return { ...u, deleted: false }
            }
            return u
          }),
        )
        toast.success("Usuario restaurado")
      })
      .catch((err) => {
        console.log(err)
        toast.error("Error al restaurar usuario")
      })
  }

  return (
    <WrapperUI title="Lista de usuarios">
      <MyTable
        data={users}
        loading={loadData}
        title="usuario"
        titlePlural="usuarios"
        withDeleted={showDeleted}
        handleDelete={handleDelete}
        handleRestore={handleRestore}
      />
    </WrapperUI>
  )
}
