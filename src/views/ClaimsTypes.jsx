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

  useEffect(() => {
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
      })
  }, [token])

  const handleAdd = (newData) => {
    toast.promise(
      new Promise((resolve, reject) => {
        axios
          .post(`${API_URL}/tipo-reclamo`, newData, {
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
    // axios
    //   .delete(`${API_URL}/calle/eliminar/${id}`, {
    //     headers: { Authorization: `Bearer ${token}` },
    //   })
    //   .then((res) => {
    //     setStreets(streets.filter((s) => s.id !== id))
    //     console.log(res)
    //   })

    setData(data.filter((s) => s.id !== id))
    alert("Tipo de reclamo eliminado correctamente")
  }

  return (
    <WrapperUI title="Tipos de reclamos">
      <Suspense fallback={<div>Cargando...</div>}>
        <MyTable
          data={data}
          title="tipo de reclamo"
          titlePlural="tipos de reclamos"
          handleDelete={handleDelete}
          handleAdd={handleAdd}
        />
      </Suspense>
    </WrapperUI>
  )
}
