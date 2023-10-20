import axios from "axios"
import { useState, useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import { MyTable } from "../components/MyTable"

const API_URL = import.meta.env.VITE_API_URL

export function NeighborhoodsList() {
  const { token } = useAuth()
  const [data, setData] = useState([])

  useEffect(() => {
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
    alert("Barrio eliminado correctamente")
  }

  return (
    <>
      <h2 className="font-bold">Barrios List</h2>
      <MyTable
        data={data}
        title="barrio"
        titlePlural="barrios"
        handleDelete={handleDelete}
      />
    </>
  )
}
