import { useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { Button } from "@nextui-org/react"
import { useNavigate } from "react-router-dom"
import { Navbar } from "../components/Navbar"
import logoutIcon from "../assets/logout-2-linear.svg"
import penIcon from "../assets/pen-2-linear.svg"
import claimsIcon from "../assets/checklist-minimalistic-linear.svg"
import arrowIcon from "../assets/alt-arrow-right-linear.svg"
import { Link } from "react-router-dom"

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
				<header className="flex items-center flex-col gap-2 mb-4">
					<img
						src={user.photoURL || "/chicken.svg"}
						alt="Imagen de perfil"
						className="rounded-full w-24"
					/>
					<p>{user?.displayName || user?.email}</p>
				</header>
				<ul className="p-4 flex flex-col gap-2">
					<li>
						<Button
							as={Link}
							to="/profile/edit"
							isLoading={loading}
							variant="light"
							className="w-full"
							startContent={
								<img
									src={penIcon}
									alt="Salir"
									width={24}
								/>
							}
							endContent={
								<img
									src={arrowIcon}
									alt="Salir"
									width={24}
								/>
							}>
							<span className="grow">Editar perfil</span>
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
