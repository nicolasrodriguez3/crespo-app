import axios from "axios"
import { useState, useEffect, lazy, Suspense } from "react"
import { useAuth } from "../hooks/useAuth"
import { WrapperUI } from "../components/WrapperUI"
import toast from "react-hot-toast"

const MyTable = lazy(() => import("../components/MyTable"))

const API_URL = import.meta.env.VITE_API_URL

export function NeighborhoodsList() {
  const { token } = useAuth()
  const [data, setData] = useState([])
  const [withDeleted, setWithDeleted] = useState(false)
  const [loadData, setLoadData] = useState(false)

  useEffect(() => {
    if (withDeleted) return
    setLoadData(true)

    axios
      .get(`${API_URL}/barrio/buscar-todas`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        //parsear data
        const dataParsed = res.data.map((s) => {
          return {
            id: s.id,
            data: s.barrio,
          }
        })
        setData(dataParsed)
        setLoadData(false)
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
        toast.error("Error al cargar los barrios")
      })
  }, [token, withDeleted])

  useEffect(() => {
    if (!withDeleted) return
    setLoadData(true)

    axios
      .get(`${API_URL}/barrio/buscar-todas-con-eliminadas`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const idsActive = data.map((barrio) => barrio.id)
        const deletedData = res.data.map((barrio) => {
          return {
            deleted: !idsActive.includes(barrio.id),
            id: barrio.id,
            data: barrio.barrio,
            ...barrio,
          }
        })
        console.log(deletedData)
        setData(deletedData)
        setLoadData(false)
      })
      .catch((err) => {
        console.log(err)
        toast.error("Error al cargar los barrios")
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
          .post(`${API_URL}/barrio`, newData, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            console.log(res)
            setData([...data, newData])
            resolve("Barrio agregado correctamente")
          })
          .catch((err) => {
            console.log(err)
            reject("Error al agregar el barrio")
          })
      }),
      {
        loading: "Agregando barrio...",
        success: (msg) => msg,
        error: (msg) => msg,
      },
    )
  }

  const handleDelete = (id) => {
    axios
      .delete(`${API_URL}/barrio/eliminar/${id}`, {
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
        toast.success("Barrio eliminado")
      })
      .catch((err) => {
        console.log(err)
        toast.error("Error al eliminar el barrio")
      })
  }

  const handleRestore = (id) => {
    axios
      .post(
        `${API_URL}/barrio/reciclar/${id}`,
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
        toast.success("Barrio restaurado")
      })
      .catch((err) => {
        console.log(err)
        toast.error("Error al restaurar el barrio")
      })
  }

  return (
    <WrapperUI title="Barrios">
      <Suspense fallback={<div>Cargando...</div>}>
        <MyTable
          data={data}
          loading={loadData}
          title="barrio"
          titlePlural="barrios"
          handleDelete={handleDelete}
          handleRestore={handleRestore}
          handleAdd={handleAdd}
          showDeleted={showDeleted}
        />
      </Suspense>
    </WrapperUI>
  )
}
