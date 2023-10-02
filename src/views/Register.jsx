import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Button, Input } from "@nextui-org/react"
import { EyeFilledIcon } from "../assets/icons/EyeFilledIcon"
import { EyeSlashFilledIcon } from "../assets/icons/EyeSlashFilledIcon"
import wave from "../assets/imgs/wave-top.svg"

export function Register() {
  const navigate = useNavigate()

  const [isVisible, setIsVisible] = useState(false)
  const [error, setError] = useState(null)

  const formik = useFormik({
    initialValues: {
      name: "",
      address: "",
      phone: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("El correo no es válido")
        .required("Ingrese su correo."),
      password: Yup.string()
        .min(6, "Su contraseña debe tener al menos 6 caracteres")
        .required("Ingrese su contraseña"),
      name: Yup.string().required("Ingrese su nombre completo"),
      address: Yup.string().required("Ingrese su dirección"),
      phone: Yup.number()
        .typeError("Ingrese unicamente números")
        .required("Ingrese su número de teléfono")
        .positive("El número no puede ser negativo")
        .integer("Solo valores enteros"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setError(null)
      console.log(values)
      try {
        setSubmitting(false)
        navigate("/")
      } catch (err) {
        setSubmitting(false)
        setError(err)
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
    <main className="flex min-h-screen w-full flex-col items-center bg-gray-50">
      <div className="flex min-h-[150px]  w-full items-center justify-center bg-gradient-to-t from-[#ffcc00] to-gold pt-8 ">
        <img
          src="/chicken.svg"
          alt="Logo de la app"
          width={80}
        />
      </div>
      <section className="relative flex min-h-[40vh] w-full flex-col items-center gap-8 pb-8 pt-20 ">
        <img
          src={wave}
          width={"100%"}
          className="absolute top-0 block h-24 w-full"
        />
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-xs flex-col gap-4"
        >
          <Input
            value={values.name}
            name="name"
            id="name"
            onChange={handleChange}
            onBlur={handleBlur}
            type="text"
            label="Nombre y apellido"
            isInvalid={touched.name && errors.name}
            errorMessage={touched.name && errors.name ? errors.name : ""}
          />

          <Input
            value={values.address}
            name="address"
            id="address"
            onChange={handleChange}
            onBlur={handleBlur}
            type="text"
            label="Dirección"
            isInvalid={touched.address && errors.address}
            errorMessage={
              touched.address && errors.address ? errors.address : ""
            }
          />

          <Input
            value={values.phone}
            name="phone"
            id="phone"
            onChange={handleChange}
            onBlur={handleBlur}
            type="text"
            label="Teléfono"
            isInvalid={touched.phone && errors.phone}
            errorMessage={touched.phone && errors.phone ? errors.phone : ""}
          />

          <Input
            value={values.email}
            name="email"
            id="email"
            onChange={handleChange}
            onBlur={handleBlur}
            type="email"
            label="Correo"
            autoComplete="true"
            isInvalid={touched.email && errors.email}
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
            isInvalid={touched.password && errors.password}
            errorMessage={
              touched.password && errors.password ? errors.password : ""
            }
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={() => setIsVisible(!isVisible)}
              >
                {isVisible ? (
                  <EyeSlashFilledIcon className="pointer-events-none text-2xl text-default-400" />
                ) : (
                  <EyeFilledIcon className="pointer-events-none text-2xl text-default-400" />
                )}
              </button>
            }
            type={isVisible ? "text" : "password"}
          />

          {error && <p className="text-red-400">{error}</p>}
          <Button
            type="submit"
            className="mt-8 bg-gold"
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
            Registrarse
          </Button>
        </form>

        <p>
          ¿Ya tienes una cuenta?{" "}
          <Link
            to="/login"
            className="underline"
          >
            Iniciar sesión
          </Link>
        </p>
      </section>
    </main>
  )
}
