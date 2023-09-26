import { useEffect } from "react"
import { HomeHeader } from "../components/HomeHeader"
import { CircularProgress } from "@nextui-org/react"
import Post from "../components/Post"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../firebase.config"
import { useState } from "react"

export function Home() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const getPosts = async () => {
      const querySnapshot = await getDocs(collection(db, "posts"))
      let data = []
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, data: doc.data() })
      })
      setPosts(data)
    }

    try {
      getPosts()
    } catch (error) {
      throw new Error("Error obteniendo los posts")
    }
  }, [])

  return (
    <>
      <HomeHeader />
      <div className="flex min-h-screen w-full flex-col gap-4 bg-gray-50 pb-12">
        {posts.length ? (
          posts?.map(({ data, id }) => (
            <Post
              key={id}
              data={data}
            />
          ))
        ) : (
          <div className="flex w-full justify-center">
            <CircularProgress
              size="sm"
              aria-label="Cargando..."
            />
          </div>
        )}
      </div>
    </>
  )
}
