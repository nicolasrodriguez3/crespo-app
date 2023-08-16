import { HomeHeader } from "../components/HomeHeader"
import Post from "../components/Post"
import { data } from "../data/posts"

export function Home() {
	return (
		<>
		<HomeHeader />
		<div className="w-full min-h-screen flex flex-col gap-4 pb-12">	
			{data.map(data => <Post key={data.id} data={data} />)}	
		</div>
		</>
	)
}
