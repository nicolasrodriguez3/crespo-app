import { useEffect, useState } from "react"
import { HomeHeader } from "../components/HomeHeader"
import {
  CircularProgress,
  Card,
  CardBody,
  CardFooter,
  Image,
} from "@nextui-org/react"
import Post from "../components/Post"
import { useAuth } from "../hooks/useAuth"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export function Home() {
  const navigate = useNavigate()
  const { user, token } = useAuth()

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // obtener los posts
    const getPosts = async () => {
      const response = await axios.get(
        "https://vps-3450851-x.dattaweb.com:9088/api/reclamo/buscar-todos-mis-reclamos",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      if (response.status === 200) {
        console.log(response.data)
        setPosts(response.data)
        setError(null)
      } else if (response.status === 404) {
        setPosts([])
        setError(null)
      } else {
        setError("Error obteniendo los posts")
      }
    }

    try {
      getPosts()
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
      <div className="flex min-h-screen w-full flex-col gap-4 bg-gray-50 pb-12">
        <div>
          <Card
            shadow="sm"
            isPressable
            onPress={() => console.log("item pressed")}
          >
            <CardBody className="overflow-visible p-0">
              <Image
                shadow="sm"
                radius="lg"
                width="100%"
                alt="test"
                className="h-[140px] w-full object-cover"
                src="/chicken.svg"
              />
            </CardBody>
            <CardFooter className="justify-between text-small">
              <b>prueba</b>
              <p className="text-default-500">1234</p>
            </CardFooter>
          </Card>
        </div>
        {posts.length === 0 ? (
          <p className="p-4 text-center">No hay posts</p>
        ) : (
          // todo agregar imagen
          posts?.map((post) => (
            <Post
              key={post.id}
              data={post}
            />
          ))
        )}
      </div>
    </>
  )
}
