import {
  Card,
  CardHeader,
  CardBody,
  Divider,
} from "@nextui-org/react"
import axios from "axios"
import { useEffect, useState } from "react"

import { useAuth } from "../hooks/useAuth"
const API_URL = import.meta.env.VITE_API_URL

export const PostView = () => {
  const { token } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    axios
      .get(`${API_URL}/reclamo/buscar-todos-mis-reclamos`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const imageUrl = `${API_URL}${res.imagen.path}/${res.imagen.nombre}`
        //! parsear data

        setPosts(res.data)
        console.log(res.data)
      })
      .catch((error) => {
        setError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [token])

  if (loading) {
    return <p>Cargando...</p>
  }

  return (
    <div>
      {posts.map((post) => (
        <Card
          className="mb-4 max-w-[400px]"
          key={post.id}
        >
          <CardHeader>
            <div className="flex flex-col">
              <p className="text-md">Reclamo #{post.id}</p>
              <p className="text-small text-default-500">
                Estado: {post.seguimiento.estados[0].estado}
              </p>
            </div>
          </CardHeader>
          {post.imagen && (
            <>
            <Divider />
              <CardBody>
                <img
                  src={`${API_URL}${post.imagen.path}/${post.imagen.nombre}`}
                  alt="Imagen de reclamo"
                  className="w-full h-full"
                />
              </CardBody>
              <Divider />
            </>
          )}
          <CardBody>
            <div className="flex flex-col">
              <p>{post.descripcion}</p>
              <p className="text-sm text-gray-900">
                {post.calle.calle} {post.altura}
              </p>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  )
}
