import { useEffect, useState } from "react"
import { HomeHeader } from "../components/HomeHeader"
import {
  CircularProgress,
  Button,
  Card,
  CardBody,
  CardFooter,
  Image,
} from "@nextui-org/react"
import Post from "../components/Post"
import { useAuth } from "../hooks/useAuth"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"

const getPosts = async (token) => {
  const response = await axios.get(
    "https://vps-3450851-x.dattaweb.com:9088/api/reclamo/buscar-todos-mis-reclamos",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  return { data: response.data, status: response.status }
}

export function Home() {
  const navigate = useNavigate()
  const { user, token } = useAuth()

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setError(null)
    setLoading(true)

    // obtener los posts
    try {
      getPosts(token).then((response) => {
        if (response.status === 200) {
          console.log(response.data)
          setPosts(response.data)
        } else {
          setError("Error obteniendo los posts")
        }
      })
    } catch (error) {
      setError(error)
      console.log(error)
      throw new Error("Error obteniendo los posts")
    }
    setLoading(false)
  }, [token])

  if (loading) {
    return (
      <div className="flex w-full justify-center">
        <CircularProgress
          size="sm"
          aria-label="Cargando..."
        />
      </div>
    )
  }

  if (error) {
    return (
      <>
        <HomeHeader />
        <div className="flex min-h-screen w-full flex-col items-center bg-gray-50">
          <div className="flex w-full flex-col items-center justify-center gap-4 pt-4">
            <p className="text-center">
              Ha ocurrido un error obteniendo los posts.
            </p>
          </div>
        </div>
      </>
    )
  }

  if (user?.roles.includes("JEFE")) {
    return (
      <>
        <HomeHeader />
        <div className="flex min-h-screen w-full flex-col items-center bg-gray-50">
          <div className="flex w-full flex-col items-center justify-center gap-4 pt-4">
            <p className="text-center">
              Tu rol es de administrador, por lo que puedes acceder a la sección
              de administración.
            </p>
            <button
              className="rounded-md bg-gold px-4 py-2 text-white"
              onClick={() => navigate("/admin")}
            >
              Ir a la sección de administración
            </button>
          </div>
        </div>
      </>
    )
  }

  if (user?.roles.includes("CAPATAZ")) {
    return (
      <>
        <HomeHeader />
        <div className="flex min-h-screen w-full flex-col items-center bg-gray-50">
          <div className="flex w-full flex-col items-center justify-center gap-4 pt-4">
            <p className="text-center">
              Tu rol es de capataz, por lo que puedes acceder a la sección de
              administración.
            </p>
            <button
              className="rounded-md bg-gold px-4 py-2 text-white"
              onClick={() => navigate("/admin")}
            >
              Ir a la sección de administración
            </button>
          </div>
        </div>
      </>
    )
  }

  if (user?.roles.includes("EMPLEADO")) {
    return (
      <>
        <HomeHeader />
        <div className="flex min-h-screen w-full flex-col items-center bg-gray-50">
          <div className="flex w-full flex-col items-center justify-center gap-4 pt-4">
            <p className="text-center">
              Tu rol es de empleado, por lo que puedes acceder a la sección de
              administración.
            </p>
            <button
              className="rounded-md bg-gold px-4 py-2 text-white"
              onClick={() => navigate("/admin")}
            >
              Ir a la sección de administración
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <HomeHeader />
      <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col gap-4 bg-gray-50 pb-12 pt-4">
        <div className="flex flex-col">
          <Button
            as={Link}
            to="/add"
            className="rounded-md bg-gold text-left font-bold"
          >
            Agregar reclamo
          </Button>
        </div>
        <section>
          Mis reclamos
          {posts.length === 0 ? (
            <p className="py-4 text-center">No hay posts</p>
          ) : (
            // todo agregar imagen
            posts?.map((post) => (
              <Post
                key={post.id}
                data={post}
              />
            ))
          )}
        </section>
      </div>
    </>
  )
}
