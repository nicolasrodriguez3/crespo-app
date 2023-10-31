import axios from "axios"
import { useState, useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import { MyTable } from "../components/MyTable"
import { WrapperUI } from "../components/WrapperUI"

const API_URL = import.meta.env.VITE_API_URL

export function AreasList() {
  const { token } = useAuth()
  const [data, setData] = useState([])

  useEffect(() => {
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
    alert("Area eliminado correctamente")
  }

  return (
    <WrapperUI title="Lista de áreas">
      <MyTable
        data={data}
        title="área"
        titlePlural="áreas"
        handleDelete={handleDelete}
      />
    </WrapperUI>
  )
}
