import { Home } from "./views/Home"
import { Navbar } from "./components/Navbar"
import { useAuth } from "./hooks/useAuth"

function App() {
	const { user } = useAuth()
	console.log(user)
	return (
		<>
			<Home />
			<Navbar />
		</>
	)
}

export default App
