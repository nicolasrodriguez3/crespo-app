import { Button, Input, Textarea, Select, SelectItem } from "@nextui-org/react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { v4 as uuidv4 } from "uuid"
import { Navbar } from "../components/Navbar"
import { CameraIcon } from "../assets/icons/CameraIcon"
import { categories } from "../mocks/categories"

export function AddClaim() {
  const formik = useFormik({
    initialValues: {
      title: "",
      content: "",
      category: new Set([]),
      media: null,
    },
    onSubmit: async (values, { setSubmitting }) => {
      const { title, category, content } = values
      const id = uuidv4()

      try {
        console.log({
          title,
          category,
          content,
          owner: "test",
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
      <main className="flex min-h-screen w-full flex-col items-center">
        <div className="flex min-h-[200px]  w-full items-center justify-center bg-gradient-to-t from-[#ffcc00] to-gold py-8">
          <Button
            isIconOnly
            color="warning"
            variant="faded"
            aria-label="Take a photo"
            className="h-16 w-16 rounded-full"
          >
            <CameraIcon fill="#777" />
          </Button>
        </div>

        <section className="-mt-8 flex min-h-[40vh] w-full grow flex-col items-center gap-8 rounded-t-3xl bg-gray-50 py-4 pb-12">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 p-4 "
          >
            <div className="flex flex-col gap-1">
              <Select
                label="Tipo de reclamo"
                placeholder="Seleccione el tipo de reclamo"
                items={categories}
                className="max-w-xs"
                onSelectionChange={(val) => setFieldValue("category", val)}
              >
                {(category) => (
                  <SelectItem
                    key={category.id}
                    value={category.id}
                  >
                    {category.tipo}
                  </SelectItem>
                )}
              </Select>
              <div>Seleccionado {values.category}</div>
            </div>
            <Input
              name="title"
              label="Título"
              isRequired
              variant="underlined"
              {...getFieldProps("title")}
              isInvalid={touched.title && errors.title}
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
              className="rounded-medium px-3 py-2 text-sm shadow-sm outline-none !duration-150 transition-background focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
            />
            {values.media ? (
              <img
                className="block rounded-lg"
                src={URL.createObjectURL(values.media)}
              />
            ) : (
              ""
            )}

            <Button
              type="submit"
              className="bg-gold"
              isLoading={isSubmitting}
              spinner={
                <svg
                  className="h-5 w-5 animate-spin text-current"
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
              }
            >
              Cargar reclamo
            </Button>
          </form>
        </section>
      </main>
      <Navbar />
    </>
  )
}
