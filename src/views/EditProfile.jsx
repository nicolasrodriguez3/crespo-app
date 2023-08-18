import { useFormik } from "formik"
import { useState } from "react"
import * as Yup from "yup"
import { Button, ButtonGroup, Input, Badge, Avatar } from "@nextui-org/react"
import { useAuth } from "../hooks/useAuth"
import editIcon from "../assets/pen-linear.svg"

export function EditProfile() {
	const { user } = useAuth()

	const [error, setError] = useState(null)

	const formik = useFormik({
		initialValues: {
			email: "",
			password: "",
		},
		validationSchema: Yup.object({
			email: Yup.string().required("Ingrese su correo."),
			password: Yup.string().required("Ingrese su contraseña"),
		}),
		onSubmit: async (values, { setSubmitting }) => {
			setError(null)

			setSubmitting(false)

			console.log(values)
		},
	})

	const { values, handleChange, handleSubmit, handleBlur, touched, errors, isSubmitting } = formik

	return (
		<main className="w-full min-h-screen bg-gradient-to-b from-[#FFD73A] from-10% to-50% flex flex-col items-center gap-4">
			<div className="flex justify-center items-end grow">
				<Badge
					isOneChar
					className="w-10 h-10 text-large"
					content={
						<img
							src={editIcon}
							width={24}
						/>
					}
					color="warning"
					shape="circle"
					placement="top-right">
					<Avatar
						radius="full"
						className="w-20 h-20 text-large"
						src="/chicken.svg"
						name={user?.name}
					/>
				</Badge>
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
						type="text"
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
						Registrarse
					</Button>
				</form>
			</section>
		</main>
	)
}
