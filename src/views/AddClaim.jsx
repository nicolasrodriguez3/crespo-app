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
import { collection, addDoc } from "firebase/firestore"
import { getStorage, ref, uploadBytes } from "firebase/storage"
import { v4 as uuidv4 } from "uuid"
import { db } from "../firebase.config"
import { useAuth } from "../hooks/useAuth"
import { Navbar } from "../components/Navbar"

export function AddClaim() {
	const storage = getStorage()
	const { user } = useAuth()
	const formik = useFormik({
		initialValues: {
			title: "",
			content: "",
			category: "",
			media: null,
		},
		onSubmit: async (values, { setSubmitting }) => {
			const { title, category, content, media } = values
			const id = uuidv4()

			try {
				const storageRef = ref(storage, `posts/${id}`)
				uploadBytes(storageRef, media)
			} catch (error) {
				console.error(error)
				throw new Error("Error subiendo la imagen al servidor.")
			}

			try {
				await addDoc(collection(db, "posts"), {
					title,
					category,
					content,
					owner: user.uid,
					status: "sin revisar",
					media: [id],
				})
			} catch (error) {
				console.error(error)
				throw new Error("Error cargando los datos del post.")
			}
			resetForm()
			setSubmitting(false)
		},
		validationSchema: Yup.object({
			title: Yup.string().required("Por favor ingrese un título"),
			category: Yup.string().required("Por favor seleccione una categoria."),
		}),
	})

	const {
		values,
		touched,
		errors,
		isSubmitting,
		setFieldValue,
		resetForm,
		handleSubmit,
		getFieldProps,
	} = formik

	return (
		<>
			<main className="w-full min-h-screen bg-gradient-to-b from-[#FFD73A] from-10% to-50% flex flex-col items-center gap-4">
				<div className="flex justify-center items-end grow">
					<img src="/chicken.svg" alt="Logo de la app" width={50} />
				</div>
				<section className="min-h-[40vh] w-full max-w-xs pb-12">
					<form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 ">
						<div className="flex flex-col gap-1">
							<Dropdown type="listbox">
								<DropdownTrigger>
									<Button variant="bordered">
										{values.category === "" ? "Seleccione una categoría" : values.category}
									</Button>
								</DropdownTrigger>
								<DropdownMenu
									name="category"
									aria-label="Categoría"
									selectionMode="single"
									disallowEmptySelection
									selectedKeys={values.category}
									onAction={(value) => setFieldValue("category", value)}>
									<DropdownItem key="Reclamos">Reclamos</DropdownItem>
									<DropdownItem key="Sugerencias">Sugerencias</DropdownItem>
									<DropdownItem key="Denuncias">Denuncias</DropdownItem>
								</DropdownMenu>
							</Dropdown>
							{touched.category && errors.category ? (
								<div className="text-tiny text-danger">{errors.category}</div>
							) : null}
						</div>

						<Input
							name="title"
							label="Título"
							isRequired
							variant="underlined"
							{...getFieldProps("title")}
							validationState={touched.title && errors.title ? "invalid" : "valid"}
							errorMessage={touched.title && errors.title ? errors.title : ""}
						/>

						<Textarea
							label="Description"
							labelPlacement="inside"
							variant="underlined"
							placeholder="Ingrese una descripción"
							{...getFieldProps("content")}
						/>

						<input
							type="file"
							name="media"
							id="media"
							onChange={(e) => setFieldValue("media", e.target.files[0])}
							accept="image/*"
							className="shadow-sm text-sm px-3 rounded-medium transition-background motion-reduce:transition-none outline-none !duration-150 focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background py-2"
						/>
						{values.media ? (
							<img className="rounded-lg block" src={URL.createObjectURL(values.media)} />
						) : (
							""
						)}

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
			<Navbar />
		</>
	)
}
