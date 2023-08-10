import logo from '../assets/logo-full.png'
import {useAuth} from '../hooks/useAuth'
import { Button } from "@nextui-org/react"

export function HomeHeader() {
	const {user, logout} = useAuth()

	const name = user.email ?? "Nico"

	const handleLogout = async () => {
		await logout()
	}

	return (
		<header className="w-full text-center">
			<h1 className="bg-gold p-2 flex justify-center">
				<img src={logo} alt='Logo de la ciudad' className='block w-[180px]'/>
			</h1>
			<Button onClick={handleLogout}>Logout</Button>
			<h2 className="bg-gold/80 text-lg p-3">Buen dia, {name}.</h2>
		</header>
	)
}
