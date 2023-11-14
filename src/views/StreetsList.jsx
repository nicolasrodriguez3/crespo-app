import axios from "axios"
import { useState, useEffect, lazy, Suspense } from "react"
import { useAuth } from "../hooks/useAuth"
import { WrapperUI } from "../components/WrapperUI"
import toast from "react-hot-toast"

const MyTable = lazy(() => import("../components/MyTable"))

const API_URL = import.meta.env.VITE_API_URL

export function StreetsList() {
  const { token } = useAuth()
  const [data, setData] = useState([])
  const [withDeleted, setWithDeleted] = useState(false)
  const [loadData, setLoadData] = useState(false)

  useEffect(() => {
    if (withDeleted) return
    setLoadData(true)

    axios
      .get(`${API_URL}/calle/buscar-todas`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        //parsear data
        const dataParsed = res.data.map((s) => {
          return {
            id: s.id,
            data: s.calle,
          }
        })

        setData(dataParsed)
        setLoadData(false)
      }).catch((err) => {
        console.log(err)
        toast.error("Error al cargar las calles")
      })

  }, [token, withDeleted])

  
  useEffect(() => {
    if (!withDeleted) return
    setLoadData(true)

    axios
      .get(`${API_URL}/calle/buscar-todas-con-eliminadas`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const idsActive = data.map((d) => d.id)
        const deletedData = res.data.map((d) => {
          return {
            deleted: !idsActive.includes(d.id),
            id: d.id,
            data: d.calle,
            ...d,
          }
        })

        setData(deletedData)
        setLoadData(false)
      })
      .catch((err) => {
        console.log(err)
        toast.error("Error al cargar las calles")
        setLoadData(false)
      })
  }, [token, withDeleted])

  const showDeleted = () => {
    setWithDeleted(!withDeleted)
  }

const handleDelete = (id) => {
    axios
      .delete(`${API_URL}/calle/${id}`, {
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
        toast.success("Calle eliminada correctamente")
      })
      .catch((err) => {
        console.log(err)
        toast.error("Error al eliminar la calle")
      })
  }

  const handleRestore = (id) => {
    axios
      .post(
        `${API_URL}/calle/reciclar/${id}`,
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
        toast.success("Calle restaurada correctamente")
      })
      .catch((err) => {
        console.log(err)
        toast.error("Error al restaurar la calle")
      })
  }

  
  const handleAdd = (newData) => {
    toast.promise(
      new Promise((resolve, reject) => {
        axios
          .put(`${API_URL}/calle`, newData, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            console.log(res)
            setData([...data, newData])
            resolve("Calle agregada correctamente")
          })
          .catch((err) => {
            console.log(err)
            reject("Error al agregar la calle")
          })
      }),
      {
        loading: "Agregando tipo de reclamo...",
        success: (msg) => msg,
        error: (msg) => msg,
      },
    )
  }

  return (
    <WrapperUI title="Calles" >
      <Suspense fallback={<div>Cargando...</div>}>
      <MyTable
        data={data}
        loading={loadData}
        title="calle"
        titlePlural="calles"
        handleDelete={handleDelete}
        handleRestore={handleRestore}
        showDeleted={showDeleted}
        handleAdd={handleAdd}
      />
      </Suspense>
    </WrapperUI>

  )
}
