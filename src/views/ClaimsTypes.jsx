import axios from "axios"
import { useState, useEffect, lazy, Suspense } from "react"
import { useAuth } from "../hooks/useAuth"
import { WrapperUI } from "../components/WrapperUI"
import toast from "react-hot-toast"

const MyTable = lazy(() => import("../components/MyTable"))

const API_URL = import.meta.env.VITE_API_URL

export function ClaimsTypes() {
  const { token } = useAuth()
  const [data, setData] = useState([])
  const [withDeleted, setWithDeleted] = useState(false)
  const [loadData, setLoadData] = useState(false)

  useEffect(() => {
    if (withDeleted) return
    setLoadData(true)

    axios
      .get(`${API_URL}/tipo-reclamo/buscar-todas`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        //parsear data
        const dataParsed = res.data.map((s) => {
          return {
            id: s.id,
            data: s.tipo,
          }
        })
        setData(dataParsed)
        setLoadData(false)
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
        toast.error("Error al cargar los tipos de reclamos")
      })
  }, [token, withDeleted])

  useEffect(() => {
    if (!withDeleted) return
    setLoadData(true)

    axios
      .get(`${API_URL}/tipo-reclamo/buscar-todas-con-eliminadas`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const idsActive = data.map((tipo) => tipo.id)
        const deletedData = res.data.map((tipo) => {
          return {
            deleted: !idsActive.includes(tipo.id),
            id: tipo.id,
            data: tipo.tipo,
            ...tipo,
          }
        })
        console.log(deletedData)
        setData(deletedData)
        setLoadData(false)
      })
      .catch((err) => {
        console.log(err)
        toast.error("Error al cargar usuarios")
        setLoadData(false)
      })
  }, [token, withDeleted])

  const showDeleted = () => {
    setWithDeleted(!withDeleted)
  }

  const handleAdd = (newData) => {
    toast.promise(
      new Promise((resolve, reject) => {
        axios
          .put(`${API_URL}/tipo-reclamo`, newData, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            console.log(res)
            setData([...data, newData])
            resolve("Tipo de reclamo agregado correctamente")
          })
          .catch((err) => {
            console.log(err)
            reject("Error al agregar tipo de reclamo")
          })
      }),
      {
        loading: "Agregando tipo de reclamo...",
        success: (msg) => msg,
        error: (msg) => msg,
      },
    )
  }

  const handleDelete = (id) => {
    axios
      .delete(`${API_URL}/tipo-reclamo/eliminar/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        if (!withDeleted) {
          setData((prev) => prev.filter((u) => u.id !== id))
        } else {
          setData((prev) =>
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
        `${API_URL}/tipo-reclamo/reciclar/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then(() => {
        setData((prev) =>
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
    <WrapperUI title="Tipos de reclamos">
      <Suspense fallback={<div>Cargando...</div>}>
        <MyTable
          data={data}
          title="tipo de reclamo"
          titlePlural="tipos de reclamos"
          handleDelete={handleDelete}
          handleRestore={handleRestore}
          handleAdd={handleAdd}
          showDeleted={showDeleted}
          loading={loadData}
        />
      </Suspense>
    </WrapperUI>
  )
}
