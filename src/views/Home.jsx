import { useEffect, useState } from "react"
import { HomeHeader } from "../components/HomeHeader"
import { CircularProgress } from "@nextui-org/react"
import Post from "../components/Post"

export function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const getPosts = async () => {
      // todo: Fetch posts
      let data = []
      setPosts(data)
    }
    setError(null)

    try {
      getPosts()
    } catch (error) {
      setError(error)
      console.log(error)
      throw new Error("Error obteniendo los posts")
    }
    setLoading(false)
  }, [])

  if (loading)
    return (
      <div className="flex w-full justify-center">
        <CircularProgress
          size="sm"
          aria-label="Cargando..."
        />
      </div>
    )

  return (
    <>
      <HomeHeader />
      <div className="flex min-h-screen w-full flex-col gap-4 bg-gray-50 pb-12">
        {posts.length === 0 ? (
          <p className="p-4 text-center">No hay posts</p>
        ) : (
          // todo agregar imagen
          posts?.map(({ data, id }) => (
            <Post
              key={id}
              data={data}
            />
          ))
        )}
      </div>
    </>
  )
}
