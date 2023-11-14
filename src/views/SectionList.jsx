import { useState, useEffect } from "react"
import { WrapperUI } from "../components/WrapperUI"
import { useAuth } from "../hooks/useAuth"
import axios from "axios"
import toast from "react-hot-toast"
import { useParams } from "react-router-dom"
import MyTable from "../components/MyTable"
import { capitalize } from "../helpers/capitalize"

const API_URL = import.meta.env.VITE_API_URL

const sectionData = {
  barrios: {
    title: "barrio",
    titlePlural: "barrios",
    nameApi: "barrio",
    url: `${API_URL}/barrio`,
    msgs: {
      error: "Error al cargar los barrios",
      add: "Barrio agregado correctamente",
      adding: "Agregando barrio...",
      addError: "Error al agregar el barrio",
      delete: "Barrio eliminado correctamente",
      deleteError: "Error al eliminar el barrio",
      restore: "Barrio restaurado correctamente",
      restoreError: "Error al restaurar el barrio",
    },
  },
  calles: {
    title: "calle",
    titlePlural: "calles",
    nameApi: "calle",
    url: `${API_URL}/calle`,
    msgs: {
      error: "Error al cargar las calles",
      add: "Calle agregada correctamente",
      adding: "Agregando calle...",
      addError: "Error al agregar la calle",
      delete: "Calle eliminada correctamente",
      deleteError: "Error al eliminar la calle",
      restore: "Calle restaurada correctamente",
      restoreError: "Error al restaurar la calle",
    },
  },
  usuarios: {
    title: "usuario",
    titlePlural: "usuarios",
    nameApi: "nombre",
    url: `${API_URL}/usuario`,
    msgs: {
      error: "Error al cargar los usuarios",
      add: "Usuario agregado correctamente",
      adding: "Agregando usuario...",
      addError: "Error al agregar el usuario",
      delete: "Usuario eliminado correctamente",
      deleteError: "Error al eliminar el usuario",
      restore: "Usuario restaurado correctamente",
      restoreError: "Error al restaurar el usuario",
    },
  },
  areas: {
    title: "área",
    titlePlural: "áreas",
    nameApi: "area",
    url: `${API_URL}/area`,
    msgs: {
      error: "Error al cargar las áreas",
      add: "Área agregada correctamente",
      adding: "Agregando área...",
      addError: "Error al agregar el área",
      delete: "Área eliminada correctamente",
      deleteError: "Error al eliminar el área",
      restore: "Área restaurada correctamente",
      restoreError: "Error al restaurar el área",
    },
  },
  "tipos-de-reclamos": {
    title: "tipo de reclamo",
    titlePlural: "tipos de reclamos",
    nameApi: "tipo",
    url: `${API_URL}/tipo-reclamo`,
    msgs: {
      error: "Error al cargar los tipos de reclamos",
      add: "Tipo de reclamo agregado correctamente",
      adding: "Agregando tipo de reclamo...",
      addError: "Error al agregar el tipo de reclamo",
      delete: "Tipo de reclamo eliminado correctamente",
      deleteError: "Error al eliminar el tipo de reclamo",
      restore: "Tipo de reclamo restaurado correctamente",
      restoreError: "Error al restaurar el tipo de reclamo",
    },
  },
}

function SectionList() {
  const { sectionName } = useParams()
  const { token } = useAuth()
  const [data, setData] = useState([])
  const [withDeleted, setWithDeleted] = useState(false)
  const [loadData, setLoadData] = useState(false)

  const { title, titlePlural, nameApi, msgs, url } = sectionData[sectionName]

  useEffect(() => {
    if (withDeleted) return
    setLoadData(true)

    axios
      .get(`${url}/buscar-todas`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        //parse data
        const dataParsed = res.data.map((s) => {
          return {
            id: s.id,
            data: s[nameApi],
          }
        })
        setData(dataParsed)
        setLoadData(false)
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
        toast.error(msgs.error)
      })
  }, [token, withDeleted])

  useEffect(() => {
    if (!withDeleted) return
    setLoadData(true)

    axios
      .get(`${url}/buscar-todas-con-eliminadas`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const idsActive = data.map((el) => el.id)
        const deletedData = res.data.map((el) => {
          return {
            deleted: !idsActive.includes(el.id),
            id: el.id,
            data: el[nameApi],
            ...el,
          }
        })
        console.log(deletedData)
        setData(deletedData)
        setLoadData(false)
      })
      .catch((err) => {
        console.log(err)
        toast.error(msgs.error)
        setLoadData(false)
      })
  }, [token, withDeleted])

  const showDeleted = () => {
    setWithDeleted(!withDeleted)
  }

  const handleAdd = (newData) => {
    toast.promise(
      new Promise((resolve, reject) => {
        axios
          .post(`${url}`, newData, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            console.log(res)
            setData([...data, newData])
            resolve(msgs.add)
          })
          .catch((err) => {
            console.log(err)
            reject(msgs.addError)
          })
      }),
      {
        loading: `Agregando ${title}...`,
        success: (msg) => msg,
        error: (msg) => msg,
      },
    )
  }

  const handleDelete = (id) => {
    toast.promise(
      new Promise((resolve, reject) => {
        axios
          .delete(`${url}/${id}`, {
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
            resolve(msgs.delete)
          })
          .catch((err) => {
            console.log(err)
            reject(msgs.deleteError)
          })
      }),
      {
        loading: `Eliminando ${title}...`,
        success: (msg) => msg,
        error: (msg) => msg,
      },
    )
  }

  const handleRestore = (id) => {
    toast.promise(
      new Promise((resolve, reject) => {
        axios
          .post(
            `${url}/reciclar/${id}`,
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
            resolve(msgs.restore)
          })
          .catch((err) => {
            console.log(err)
            reject(msgs.restoreError)
          })
      }),
      {
        loading: `Restaurando ${title}...`,
        success: (msg) => msg,
        error: (msg) => msg,
      },
    )
  }

  if (!sectionData[sectionName]) {
    return <div>Sección no encontrada</div>
  }

  return (
    <WrapperUI title={capitalize(titlePlural)}>
      <MyTable
        data={data}
        loading={loadData}
        title={title}
        titlePlural={titlePlural}
        section={sectionName}
        handleDelete={handleDelete}
        handleRestore={handleRestore}
        handleAdd={handleAdd}
        showDeleted={showDeleted}
      />
    </WrapperUI>
  )
}
export default SectionList
