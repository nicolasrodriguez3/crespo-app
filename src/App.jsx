import { Home } from "./views/Home"
import { Navbar } from "./components/Navbar"
import { useAuth } from "./hooks/useAuth"

function App() {
	return (
		<>
			<Home />
			<Navbar />
		</>
	)
}

export default App
