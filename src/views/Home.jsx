import { useEffect } from "react"
import { HomeHeader } from "../components/HomeHeader"
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
			<div className="w-full min-h-screen flex flex-col gap-4 pb-12">
				{
					posts.length ? 
				posts?.map(({ data, id }) => (
					<Post key={id} data={data} />
				))
					: <p>Cargando</p>
			}
			</div>
		</>
	)
}
