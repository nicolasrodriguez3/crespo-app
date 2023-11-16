import { useState, useEffect, lazy } from "react"
import { WrapperUI } from "../components/WrapperUI"
import { useAuth } from "../hooks/useAuth"
import axios from "axios"
import toast from "react-hot-toast"
import { useParams } from "react-router-dom"
import { capitalize } from "../helpers/capitalize"
import { sectionData } from "../constants/sectionData"
import { useCallback } from "react"

const MyTable = lazy(() => import("../components/MyTable"))

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

  const handleAdd = useCallback(
    (newData) => {
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
    },
    [title],
  )

  const handleDelete = useCallback(
    (id) => {
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
    },
    [title],
  )

  const handleRestore = useCallback(
    (id) => {
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
    },
    [title],
  )

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
