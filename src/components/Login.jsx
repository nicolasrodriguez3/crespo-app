import google from "../assets/google.svg"
import facebook from "../assets/facebook.svg"

import { Button, ButtonGroup } from "@nextui-org/react"
import { useState } from "react"
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { validateErrorOnAuth } from "../helpers/validateErrorOnAuth"

function Login() {
	const { login, loginWithGoogle, loginWithFacebook } = useAuth()
	const navigate = useNavigate()

	const [user, setUser] = useState({
		email: "",
		password: "",
	})
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(false)

	const handleChange = ({ target: { name, value } }) => {
		setUser({
			...user,
			[name]: value,
		})
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError(null)
		setLoading(true)

		try {
			await login(user.email, user.password)
			setLoading(false)
			navigate("/")
		} catch (err) {
			setLoading(false)
			const errorMsg = validateErrorOnAuth(err.code)
			setError(errorMsg)
		}
	}

	const handleGoogleSignin = async () => {
		try{
			await loginWithGoogle()
			navigate("/")
		} catch(err){
			const errorMsg = validateErrorOnAuth(err.code)
			setError(errorMsg)
		}
	}
	const handleFacebookSignin = async () => {
		try{
			await loginWithFacebook()
			navigate("/")
		} catch(err){
			const errorMsg = validateErrorOnAuth(err.code)
			setError(errorMsg)
		}
	}

	return (
		<main className="login_form w-full min-h-screen bg-gradient-to-b from-[#FFD73A] from-10% to-50% flex flex-col items-center gap-4">
			<div className="flex justify-center items-end grow">
				<img
					src="/chicken.svg"
					alt="Logo de la app"
					width={100}
				/>
			</div>
			<section className="flex flex-col items-center min-h-[40vh] gap-8 pb-8">
				<form
					onSubmit={handleSubmit}
					className="flex flex-col gap-4 w-full max-w-xs">
					<div className="relative z-0">
						<input
							type="email"
							name="email"
							id="floating_email"
							value={user.email}
							onChange={handleChange}
							required
							className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-900 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-900 peer"
							placeholder=""
						/>
						<label
							htmlFor="floating_email"
							className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-gray-900 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
							Correo
						</label>
					</div>
					<div className="relative z-0">
						<input
							type="password"
							name="password"
							id="floating_password"
							value={user.password}
							onChange={handleChange}
							required
							className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-900 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-900 peer"
							placeholder=""
						/>
						<label
							htmlFor="floating_password"
							className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-gray-900 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
							Contraseña
						</label>
						<Link to="/forgot-password" className="text-sm text-right mt-1 block">¿Olvidaste tu contraseña?</Link>
					</div>

					{error && <p className="text-red-400">{error}</p>}
					<Button
						type="submit"
						className="bg-gold"
						isLoading={loading}
						spinner={
							<svg
								className="animate-spin h-5 w-5 text-current"
								fill="none"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg">
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="3"
								/>
								<path
									className="opacity-75"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									fill="currentColor"
								/>
							</svg>
						}>
						Iniciar sesión
					</Button>
				</form>
				<section>
					<p className="text-center mb-2">o iniciar sesión con</p>
					<ButtonGroup>
						<Button className="h-12 bg-inherit" onClick={handleGoogleSignin}>
							<img
								src={google}
								width={40}
							/>
						</Button>
						<Button className="h-12 bg-inherit" onClick={handleFacebookSignin}>
							<img
								src={facebook}
								width={40}
							/>
						</Button>
					</ButtonGroup>
				</section>
				<p>¿No tienes una cuenta? <Link to="/register">Regístrate</Link></p>
			</section>
		</main>
	)
}
export default Login
