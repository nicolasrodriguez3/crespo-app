import { useState } from "react"
import Post from "../components/Post"
import { useEffect } from "react"
import { getAllPosts } from "../services/getAllPosts"
import { useAuth } from "../hooks/useAuth"
import { CircularProgress } from "@nextui-org/react"
import { HomeHeader } from "../components/HomeHeader"


export default function ClaimsList() {
	const { token } = useAuth()
  const [posts, setPosts] = useState([])
	
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

	useEffect(() => {
    setError(null)
    setLoading(true)

    // obtener los posts
    try {
      getAllPosts(token).then((response) => {
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

  return (
    <section className="flex flex-col gap-4">
      Mis reclamos
      {posts?.length === 0 ? (
        <p className="py-4 text-center">No hay posts</p>
      ) : (
        posts?.map((post) => (
          <Post
            key={post.id}
            data={post}
          />
        ))
      )}
    </section>
  )
}
