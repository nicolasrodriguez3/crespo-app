import axios from "axios"
import { useState, useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import { MyTable } from "../components/MyTable"

const API_URL = import.meta.env.VITE_API_URL

export function StreetsList() {
  const { token } = useAuth()
  const [streets, setStreets] = useState([])
  const [withDeleted, setWithDeleted] = useState(false)

  useEffect(() => {
    const url = withDeleted ? `${API_URL}/calle/buscar-todas-con-eliminadas` : `${API_URL}/calle/buscar-todas`
    
    axios
      .get(url, {
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
        setStreets(dataParsed)
      })
  }, [token, withDeleted])

  const handleDelete = (id) => {
    // axios
    //   .delete(`${API_URL}/calle/eliminar/${id}`, {
    //     headers: { Authorization: `Bearer ${token}` },
    //   })
    //   .then((res) => {
    //     setStreets(streets.filter((s) => s.id !== id))
    //     console.log(res)
    //   })

    setStreets(streets.filter((s) => s.id !== id))
    alert("Calle eliminada correctamente")
  }

  const showDeletedStreets = () => {
    setWithDeleted(!withDeleted)
  }

  return (
    <>
      <h2 className="font-bold">Streets List</h2>
      <MyTable
        data={streets}
        title="calle"
        titlePlural="calles"
        handleDelete={handleDelete}
        withDeleted={showDeletedStreets}
      />
    </>
  )
}
