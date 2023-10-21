import axios from "axios"
import { useState, useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import { MyTable } from "../components/MyTable"

const API_URL = import.meta.env.VITE_API_URL

export function ClaimStatusList() {
  const { token } = useAuth()
  const [data, setData] = useState([])

  useEffect(() => {
    axios
      .get(`${API_URL}/archivo/buscar-todas`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        //parsear data
        const dataParsed = res.data.map((s) => {
          return {
            id: s.id,
            data: s.estado,
          }
        })
        console.log(res)
        setData(dataParsed)
      })
  }, [token])


  return (
    <>
      <h2 className="font-bold">Estado reclamos List</h2>
      <MyTable
        data={data}
        theme="usuario"
      />
    </>
  )
}
