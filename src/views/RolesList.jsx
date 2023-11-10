import axios from "axios"
import { useState, useEffect, lazy, Suspense } from "react"
import { useAuth } from "../hooks/useAuth"
import { WrapperUI } from "../components/WrapperUI"

const MyTable = lazy(() => import("../components/MyTable"))

const API_URL = import.meta.env.VITE_API_URL

export function RolesList() {
  const { token } = useAuth()
  const [data, setData] = useState([])

  useEffect(() => {
    axios
      .get(`${API_URL}/rol/buscar-todas`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        //parsear data
        const dataParsed = res.data.map((s) => {
          return {
            id: s.id,
            data: s.rol,
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
    alert("Rol eliminado correctamente")
  }

  return (
      <WrapperUI title="Roles" backTo="/">
      <Suspense fallback={<div>Cargando...</div>}>
      <MyTable
        data={data}
        title="rol"
        titlePlural="roles"
        handleDelete={handleDelete}
      />
      </Suspense>
    </WrapperUI>
  )
}
