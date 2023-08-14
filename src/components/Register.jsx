import { useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { validateErrorOnAuth } from "../helpers/validateErrorOnAuth"
import { Button, ButtonGroup, Input } from "@nextui-org/react"
import google from "../assets/google.svg"
import facebook from "../assets/facebook.svg"
import { EyeFilledIcon } from "../assets/EyeFilledIcon"
import { EyeSlashFilledIcon } from "../assets/EyeSlashFilledIcon"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Link } from "react-router-dom"

export default function Register() {
	const { signup, loginWithGoogle, loginWithFacebook } = useAuth()
	const navigate = useNavigate()
	const [isVisible, setIsVisible] = useState(false)

	const [error, setError] = useState(null)

	const formik = useFormik({
		initialValues: {
			email: "",
			password: ""
		},
		validationSchema: Yup.object({
			email: Yup.string().email("El correo no es válido").required("Ingrese su correo."),
			password: Yup.string().min(6, "Su contraseña debe tener al menos 6 caracteres").required("Ingrese su contraseña")
		}),
		onSubmit: async (values, {setSubmitting}) => {
			setError(null)
	
			try {
				await signup(values.email, values.password)
				setSubmitting(false)
				navigate("/")
			} catch (err) {
				setSubmitting(false)
				const errorMsg = validateErrorOnAuth(err.code)
				setError(errorMsg)
			}
		}
	})

	const {values, handleChange, handleSubmit, handleBlur, touched, errors, isSubmitting} = formik

	const handleGoogleSignin = async () => {
		try {
			await loginWithGoogle()
			navigate("/")
		} catch (err) {
			const errorMsg = validateErrorOnAuth(err.code)
			setError(errorMsg)
		}
	}
	const handleFacebookSignin = async () => {
		try {
			await loginWithFacebook()
			navigate("/")
		} catch (err) {
			const errorMsg = validateErrorOnAuth(err.code)
			setError(errorMsg)
		}
	}

	return (
		<main className="register_form w-full min-h-screen bg-gradient-to-b from-[#FFD73A] from-10% to-50% flex flex-col items-center gap-4">
			<div className="flex justify-center items-end grow">
				<img
					src="/chicken.svg"
					alt="Logo de la app"
					width={100}
				/>
			</div>
			<section className="flex flex-col items-center min-h-[40vh] max-w-xs gap-8 pb-8">
				<form
					onSubmit={handleSubmit}
					className="flex flex-col gap-4 w-full max-w-xs">
						<Input
						value={values.email}
						name="email"
						id="email"
						onChange={handleChange}
						onBlur={handleBlur}
						type="email"
						label="Correo"
						variant="underlined"
						autoComplete="true"
						validationState={touched.email && errors.email ? "invalid" : "valid"}
						errorMessage={touched.email && errors.email ? errors.email : ""}
					/>
					
					<Input
						label="Contraseña"
						name="password"
						value={values.password}
						onChange={handleChange}
						onBlur={handleBlur}
						required
						labelPlacement="inside"
						variant="underlined"
						validationState={touched.password && errors.password ? "invalid" : "valid"}
						errorMessage={touched.password && errors.password ? errors.password : ""}
						endContent={
							<button
								className="focus:outline-none"
								type="button"
								onClick={() => setIsVisible(!isVisible)}>
								{isVisible ? (
									<EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
								) : (
									<EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
								)}
							</button>
						}
						type={isVisible ? "text" : "password"}
					/>
					
					{error && <p className="text-red-400">{error}</p>}
					<Button
						type="submit"
						className="bg-gold"
						isLoading={isSubmitting}
						spinner={
							<svg
								className="animate-spin h-5 w-5 text-current"
								fill="none"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
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
						Registrarse
					</Button>
				</form>
				<section>
					<p className="text-center mb-2">o regístrate con</p>
					<ButtonGroup>
						<Button
							className="h-12 bg-inherit"
							onClick={handleGoogleSignin}>
							<img
								src={google}
								width={40}
							/>
						</Button>
						<Button
							className="h-12 bg-inherit"
							onClick={handleFacebookSignin}>
							<img
								src={facebook}
								width={40}
							/>
						</Button>
					</ButtonGroup>
				</section>
					<p>
					¿Ya tienes una cuenta? <Link to="/login" className="underline">Iniciar sesión</Link>
				</p>
			</section>
		</main>
	)
}
