import {
	Button,
	Input,
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
	Textarea,
} from "@nextui-org/react"
import { useFormik } from "formik"
import * as Yup from "yup"

export default function AddClaim() {
	const formik = useFormik({
		initialValues: {
			title: "",
			content: "",
			category: "",
			media: null
		},
		onSubmit: async (values, { setSubmitting }) => {
			console.log(JSON.stringify(values, null, 2))
			setSubmitting(false)

		},
		validationSchema: Yup.object({
			title: Yup.string().required("Por favor ingrese un título"),
			category: Yup.string().required("Por favor seleccione una categoria."),
		}),
	})
	const { values, touched, errors, isSubmitting, setFieldValue } = formik

	return (
		<div>
			<main className="register_form w-full min-h-screen bg-gradient-to-b from-[#FFD73A] from-10% to-50% flex flex-col items-center gap-4">
				<div className="flex justify-center items-end grow">
					<img
						src="/chicken.svg"
						alt="Logo de la app"
						width={50}
					/>
				</div>
				<section className="min-h-[40vh] w-8/12 max-w-xs pb-8">
					<form
						onSubmit={formik.handleSubmit}
						className="register-form flex flex-col gap-4 p-4 ">
						<div className="flex flex-col gap-1">
							<Dropdown type="listbox">
								<DropdownTrigger>
									<Button variant="bordered">
										{formik.values.category === ""
											? "Seleccione una categoría"
											: formik.values.category}
									</Button>
								</DropdownTrigger>
								<DropdownMenu
									
									name="category"
									aria-label="Categoría"
									selectionMode="single"
									disallowEmptySelection
									selectedKeys={formik.values.category}
									onAction={(value) => formik.setFieldValue("category", value)}>
									<DropdownItem key="Reclamos">Reclamos</DropdownItem>
									<DropdownItem key="Sugerencias">Sugerencias</DropdownItem>
									<DropdownItem key="Denuncias">Denuncias</DropdownItem>
								</DropdownMenu>
							</Dropdown>
							{formik.touched.category && formik.errors.category ? (
								<div className="text-tiny text-danger">{formik.errors.category}</div>
							) : null}
						</div>
						
						<Input
							name="title"
							label="Título"
							isRequired
							variant="underlined"
							{...formik.getFieldProps("title")}
							validationState={touched.title && errors.title ? "invalid" : "valid"}
							errorMessage={touched.title && errors.title ? errors.title : ""}
						/>

						<Textarea
							label="Description"
							labelPlacement="inside"
							variant="underlined"
							placeholder="Ingrese una descripción"
							{...formik.getFieldProps("content")}
						/>

						<input
							type="file"
							name="media"
							id="media"
							capture
							onChange={e => setFieldValue("media", e.target.files[0])}
							accept="image/*"
							className="shadow-sm text-sm px-3 bg-default-100 rounded-medium transition-background motion-reduce:transition-none outline-none !duration-150 focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background py-2"
						/>
						{values.media ? <img src={URL.createObjectURL(values.media)} /> : ""}
						{values.media?.name}
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
							Cargar reclamo
						</Button>
					</form>
				</section>
			</main>
		</div>
	)
}
