import axios from "axios"
import { useState, useEffect, lazy, Suspense } from "react"
import { useAuth } from "../hooks/useAuth"
import { WrapperUI } from "../components/WrapperUI"
import toast from "react-hot-toast"

const MyTable = lazy(() => import("../components/MyTable"))

const API_URL = import.meta.env.VITE_API_URL

export function AreasList() {
  const { token } = useAuth()
  const [data, setData] = useState([])
  const [withDeleted, setWithDeleted] = useState(false)
  const [loadData, setLoadData] = useState(false)

  useEffect(() => {
    if (withDeleted) return
    setLoadData(true)

    axios
      .get(`${API_URL}/area/buscar-todas`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        //parsear data
        const dataParsed = res.data.map((s) => {
          return {
            id: s.id,
            data: s.area,
          }
        })
        setData(dataParsed)
      })
      .catch((err) => {
        console.log(err)
        toast.error("Error al cargar las áreas")
      })
  }, [token, withDeleted])

  useEffect(() => {
    if (!withDeleted) return
    setLoadData(true)

    axios
      .get(`${API_URL}/area/buscar-todas-con-eliminadas`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const idsActive = data.map((d) => d.id)
        const deletedData = res.data.map((d) => {
          return {
            deleted: !idsActive.includes(d.id),
            id: d.id,
            data: d.area,
            ...d,
          }
        })
        setData(deletedData)
      })
      .catch((err) => {
        console.log(err)
        toast.error("Error al cargar las áreas")
      })
  }, [token, withDeleted])

  const showDeleted = () => {
    setWithDeleted(!withDeleted)
  }

  
  const handleDelete = (id) => {
    axios
      .delete(`${API_URL}/area/${id}`, {
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
        toast.success("Área eliminada correctamente")
      })
      .catch((err) => {
        console.log(err)
        toast.error("Error al eliminar el área")
      })
  }

  const handleRestore = (id) => {
    axios
      .post(
        `${API_URL}/area/reciclar/${id}`,
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
        toast.success("Área restaurada correctamente")
      })
      .catch((err) => {
        console.log(err)
        toast.error("Error al restaurar el área")
      })
  }
  
  

  return (
    <WrapperUI title="Áreas">
      <Suspense fallback={<div>Cargando...</div>}>
      <MyTable
        data={data}
        loadData={loadData}
        title="área"
        titlePlural="áreas"
        handleDelete={handleDelete}
        handleRestore={handleRestore}
        showDeleted={showDeleted}
      />
      </Suspense>
    </WrapperUI>
  )
}
