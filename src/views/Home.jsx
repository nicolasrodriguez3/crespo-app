import Post from "../components/Post"
import { data } from "../data/posts"

function Home() {
	return (
		<div className="w-full min-h-screen flex flex-col gap-4 pb-12">	
			{data.map(data => <Post key={data.id} data={data} />)}
			
		</div>
	)
}
export default Home
