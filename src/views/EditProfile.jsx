import { useFormik } from "formik"
import { useState } from "react"
import * as Yup from "yup"
import {
  Button,
  Input,
  Badge,
  Avatar,
  Select
} from "@nextui-org/react"
import { useAuth } from "../hooks/useAuth"
import editIcon from "../assets/icons/pen-linear.svg"
import arrowIcon from "../assets/icons/alt-arrow-right-linear.svg"
import { useNavigate } from "react-router-dom"

const getSex = (sexSelected) => {
  switch (sexSelected) {
    case "male":
      return "Masculino"
    case "female":
      return "Femenino"
    default:
      return "Otro"
  }
}

export function EditProfile() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [error, setError] = useState(null)

  const formik = useFormik({
    initialValues: {
      nombre: user?.nombre,
      username: user?.username,
      birthDate: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required("Ingrese su nombre."),
      birthDate: Yup.string().required("Ingrese su fecha de nacimiento."),
      sex: Yup.string().required("Ingrese su sexo."),
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
    <main className="flex min-h-screen w-full flex-col items-center">
      <div className="-mb-10 flex min-h-[200px] w-full items-center justify-center bg-gradient-to-b from-[#f5c400] to-gold p-4 pb-10">
        <Badge
          isOneChar
          role="button"
          className="h-10 w-10 text-large"
          content={
            <label
              role="button"
              className="flex h-full w-full items-center justify-center"
            >
              <input
                type="file"
                name="avatar"
                id="avatar"
                className="hidden"
              />
              <img
                src={editIcon}
                width={24}
              />
            </label>
          }
          color="warning"
          shape="circle"
          placement="top-right"
        >
          <Avatar
            radius="full"
            className="h-20 w-20 rounded-full text-large"
            src={user?.photoURL || "/chicken.svg"}
            name={user?.nombre}
          />
        </Badge>
      </div>
      <section className="z-10 flex w-full grow flex-col items-center gap-8 rounded-t-3xl bg-gray-50 py-4">
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
            variant="underlined"
            autoComplete="true"
            isInvalid={touched.nombre && errors.nombre}
            errorMessage={touched.nombre && errors.nombre ? errors.nombre : ""}
          />

          <Input
            type="email"
            label="Correo"
            name="username"
            value={values.username}
            onChange={handleChange}
            isDisabled
            labelPlacement="inside"
            variant="underlined"
          />

          {error && <p className="text-red-400">{error}</p>}
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
            Guardar datos
          </Button>
        </form>
      </section>
    </main>
  )
}
