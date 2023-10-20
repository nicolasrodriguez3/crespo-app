import axios from "axios"
import { useState, useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import { MyTable } from "./MyTable"

const API_URL = import.meta.env.VITE_API_URL

export function StreetsList() {
  const { token } = useAuth()

  const [streets, setStreets] = useState([])
  const [streetSelected, setStreetSelected] = useState(null) // no funciona

  useEffect(() => {
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
          }}
          )
        setStreets(dataParsed)
        console.log(res)
      })
  }, [token])

  const handleOpen = (street) => {
    onOpen()
    setStreetSelected(street)
  }

  //const handleDelete = (onClose) => {
    // axios
    //   .delete(`${API_URL}/calle/eliminar/${streetSelected.id}`, {
    //     headers: { Authorization: `Bearer ${token}` },
    //   })
    //   .then((res) => {
    //     setStreets(streets.filter((s) => s.id !== streetSelected.id))
    //     console.log(res)
    //   })

  //   onClose()
  //   setStreets(streets.filter((s) => s.id !== streetSelected.id)) //! solo hasta llamar a la api
  //   setStreetSelected(null)
  //   alert("Calle eliminada correctamente")
  // }

  return (
    <>
      <h2 className="font-bold">Streets List</h2>
      <MyTable data={streets} theme="calle"/>
    </>
  )
}
