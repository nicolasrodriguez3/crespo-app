import { useFormik } from "formik"
import { useState } from "react"
import * as Yup from "yup"
import { Button, Input } from "@nextui-org/react"
import { useAuth } from "../hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { WrapperUI } from "../components/WrapperUI"

export function EditProfile() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [error, setError] = useState(null)

  const formik = useFormik({
    initialValues: {
      nombre: user?.nombre,
      username: user?.username,
      telefono: user?.telefono,
      direccion: user?.direccion,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required("Ingrese su nombre."),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setError(null)
        setSubmitting(false)
        // TODO: Add toast to notify user
        navigate("/")
      } catch (error) {
        setError(error)
        setSubmitting(false)
        throw new Error("Error al actualizar los datos")
      }
    },
  })

  const {
    values,
    handleChange,
    handleSubmit,
    handleBlur,
    touched,
    errors,
    isSubmitting,
  } = formik

  return (
    <WrapperUI
      title="Mis datos"
      backTo="/profile"
    >
      <div className="flex w-full items-center justify-center p-4"></div>
      <p>Próximamente...</p>
      <section className="flex w-full flex-col items-center gap-8  py-4">
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-xs flex-col gap-4"
        >
          <Input
            name="nombre"
            value={values.nombre}
            onChange={handleChange}
            onBlur={handleBlur}
            type="text"
            label="Nombre"
            isDisabled
            isInvalid={touched.nombre && errors.nombre}
            errorMessage={touched.nombre && errors.nombre ? errors.nombre : ""}
          />

          <Input
            type="email"
            label="Correo"
            name="username"
            value={values.username}
            isDisabled
            labelPlacement="inside"
          />

          <Input
            type="text"
            label="Teléfono"
            name="telefono"
            value={values.telefono}
            isDisabled
            labelPlacement="inside"
          />

          <Input
            type="text"
            label="Dirección"
            name="direccion"
            value={values.direccion}
            isDisabled
            labelPlacement="inside"
          />

          {error && <p className="text-red-400">{error}</p>}
          <Button
            type="submit"
            className="bg-gold"
            isLoading={isSubmitting}
            isDisabled
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
            Guardar datos
          </Button>
        </form>
      </section>
    </WrapperUI>
  )
}
