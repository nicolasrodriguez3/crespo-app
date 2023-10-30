import { useState, useEffect } from "react"
import { Post } from "../components/Post"
import { CircularProgress } from "@nextui-org/react"
import { useAuth } from "../hooks/useAuth"
import { getClaims, getMyClaims } from "../helpers/api"
import { WrapperUI } from "../components/WrapperUI"

export function ClaimsList({ all }) {
  const { token } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setError(null)
    setLoading(true)

    const fetchClaims = all ? getClaims : getMyClaims

    // obtener los posts
    const fetchData = async () => {
      try {
        const response = await fetchClaims(token)
        if (response.status === 200) {
          console.log(response.data)
          const mappedPosts = response.data.map((post) => ({
            id: post.id,
            descripcion: post.descripcion,
            altura: post.altura,
            calle: post.calle.calle,
            tipoReclamo: post.tipoReclamo.tipo,
            persona: post.persona,
            imagen: post.imagen,
            seguimiento: post.seguimiento.estados,
          }))
          setPosts(mappedPosts)
        } else {
          throw new Error("Error obteniendo los posts")
        }
      } catch (error) {
        console.warn("Error:", error)
        setError(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token, all])

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
      <WrapperUI>
        <div className="flex min-h-screen w-full flex-col items-center bg-gray-50">
          <div className="flex w-full flex-col items-center justify-center gap-4 pt-4">
            <p className="text-center">
              Ha ocurrido un error obteniendo los posts.
            </p>
          </div>
        </div>
      </WrapperUI>
    )
  }

  if (posts.length === 0) {
    return (
      <WrapperUI>
        <p className="py-4 text-center">No hay reclamos</p>
      </WrapperUI>
    )
  }

  return (
    <WrapperUI title={all ? "Todos los reclamos" : "Mis reclamos"}>
      <section className="flex flex-col gap-4">
        {posts.map((post) => (
          <Post
            post={post}
            key={post.id}
          />
        ))}
      </section>
    </WrapperUI>
  )
}
