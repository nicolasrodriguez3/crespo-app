import logo from '../assets/logo-full.png'
import logoutIcon from "../assets/logout.svg"
import {useAuth} from '../hooks/useAuth'
import { Button } from "@nextui-org/react"

export function HomeHeader() {
	const {user, logout} = useAuth()

	const name = user.displayName || user.email || "Nico"

	const handleLogout = async () => {
		await logout()
	}

	return (
		<header className="w-full text-center">
			<div className='bg-gold p-2 flex justify-center relative'>

			<h1 className="">
				<img src={logo} alt='Logo de la ciudad' className='block w-[180px]'/>
			</h1>
			<Button isIconOnly color='warning' variant="light" className='absolute right-4 top-1/2 -translate-y-1/2 bg-transparent' onClick={handleLogout}><img src={logoutIcon} alt="Salir" width={32}/></Button>
			</div>
			<h2 className="bg-gold/80 text-lg p-3">Buen dia, {name}.</h2>
		</header>
	)
}
