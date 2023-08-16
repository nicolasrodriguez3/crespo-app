import logo from "../assets/logo-full.png"
import { useAuth } from "../hooks/useAuth"

export function HomeHeader() {
	const { user } = useAuth()

	const name = user?.displayName || user?.email || "Nico"

	return (
		<header className="w-full text-center">
			<div className="bg-gold p-2 flex justify-center relative">
				<h1 className="">
					<img
						src={logo}
						alt="Logo de la ciudad"
						className="block w-[180px]"
					/>
				</h1>
			</div>
			<h2 className="bg-gold/80 text-lg p-3">Bienvenido, {name}.</h2>
		</header>
	)
}
