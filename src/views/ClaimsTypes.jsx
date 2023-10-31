import axios from "axios"
import { useState, useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import { MyTable } from "../components/MyTable"
import { WrapperUI } from "../components/WrapperUI"

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
    <WrapperUI title="Tipos de reclamos" >
      <MyTable
        data={data}
        title="tipo de reclamo"
        titlePlural="tipos de reclamos"
        handleDelete={handleDelete}
      />
    </WrapperUI>
  )
}
