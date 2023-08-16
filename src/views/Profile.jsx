import { useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { Button } from "@nextui-org/react"
import { useNavigate } from "react-router-dom"
import { Navbar } from "../components/Navbar"
import logoutIcon from "../assets/logout-2-linear.svg"
import penIcon from "../assets/pen-2-linear.svg"
import claimsIcon from "../assets/checklist-minimalistic-linear.svg"

export function Profile() {
	const navigate = useNavigate()
	const { user, logout } = useAuth()
	const [loading, setLoading] = useState(false)

	const handleLogout = async () => {
		setLoading(true)
		await logout()
		navigate("/login")
	}

	return (
		<>
			<div className="">
				<header className="flex items-center flex-col">
					<img
						src="chicken.svg"
						alt="Imagen de perfil"
					/>
					<p>Nico</p>
				</header>
				<ul>
					<li>
						<Button
							isLoading={loading}
							variant="light"
							startContent={
								<img
									src={penIcon}
									alt="Salir"
									width={24}
								/>
							}>
							Editar perfil
						</Button>
					</li>
					<li>
						<Button
							onClick={handleLogout}
							isLoading={loading}
							variant="light"
							startContent={
								<img
									src={claimsIcon}
									alt="Salir"
									width={24}
								/>
							}>
							Mis reclamos
						</Button>
					</li>
					<li>
						<Button
							onClick={handleLogout}
							isLoading={loading}
							variant="light"
							startContent={
								<img
									src={logoutIcon}
									alt="Salir"
									width={24}
								/>
							}>
							Cerrar sesión
						</Button>
					</li>
				</ul>
			</div>
			<Navbar />
		</>
	)
}
