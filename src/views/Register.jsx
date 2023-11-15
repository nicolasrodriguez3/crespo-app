import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Button, Input } from "@nextui-org/react"
import { EyeFilledIcon } from "../assets/icons/EyeFilledIcon"
import { EyeSlashFilledIcon } from "../assets/icons/EyeSlashFilledIcon"
import wave from "../assets/imgs/wave-top.svg"
import { useAuth } from "../hooks/useAuth"
import toast from "react-hot-toast"
import { Toaster } from "react-hot-toast"

export default function Register() {
  const { signup } = useAuth()
  const navigate = useNavigate()

  const [isVisible, setIsVisible] = useState(false)
  const [error, setError] = useState(null)

  const formik = useFormik({
    initialValues: {
      nombre: "",
      dni: "",
      direccion: "",
      telefono: "",
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .email("El correo no es válido")
        .required("Ingrese su correo."),
      dni: Yup.string()
        .matches(/^\d+$/, "Ingrese unicamente números")
        .min(7, "El número de DNI debe tener al menos 7 dígitos")
        .max(8, "El número de DNI no puede tener más de 8 dígitos")
        .required("Ingrese su número de DNI"),
      password: Yup.string()
        .min(8, "Su contraseña debe tener al menos 8 caracteres")
        .required("Ingrese su contraseña"),
      nombre: Yup.string().required("Ingrese su nombre completo").min(3, "El nombre debe tener al menos 3 caracteres").max(100, "El nombre no puede tener más de 100 caracteres"),
      direccion: Yup.string()
        .required("Ingrese su dirección")
        .min(8, "La dirección debe tener al menos 8 caracteres")
        .max(100, "La dirección no puede tener más de 100 caracteres"),
      telefono: Yup.string()
        .matches(/^\d+$/, "Ingrese unicamente números")
        .min(7, "El número de teléfono debe tener al menos 7 dígitos")
        .max(20, "El número de teléfono no puede tener más de 20 dígitos")
        .required("Ingrese su número de teléfono"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setError(null)
      console.log(values)
      try {
        await signup({ values })
        setError("¡Usuario registrado correctamente! Por favor verifique su correo electrónico.")
        toast.success("Usuario registrado correctamente, por favor verifique su correo electrónico.")
      } catch (error) {
        console.log(error)
        setError(error.message)
      }
      setSubmitting(false)
      // navigate("/")
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
    <>
    <Toaster position="top-right" />
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
            value={values.nombre}
            name="nombre"
            id="nombre"
            onChange={handleChange}
            onBlur={handleBlur}
            type="text"
            label="Nombre y apellido"
            isInvalid={touched.nombre && errors.nombre}
            errorMessage={touched.nombre && errors.nombre ? errors.nombre : ""}
          />

          <Input
            value={values.dni}
            name="dni"
            id="dni"
            onChange={handleChange}
            onBlur={handleBlur}
            type="text"
            label="Número de DNI"
            isInvalid={touched.dni && errors.dni}
            errorMessage={touched.dni && errors.dni ? errors.dni : ""}
          />

          <Input
            value={values.direccion}
            name="direccion"
            id="direccion"
            onChange={handleChange}
            onBlur={handleBlur}
            type="text"
            label="Dirección"
            isInvalid={touched.direccion && errors.direccion}
            errorMessage={
              touched.direccion && errors.direccion ? errors.direccion : ""
            }
          />

          <Input
            value={values.telefono}
            name="telefono"
            id="telefono"
            onChange={handleChange}
            onBlur={handleBlur}
            type="text"
            label="Teléfono"
            isInvalid={touched.telefono && errors.telefono}
            errorMessage={
              touched.telefono && errors.telefono ? errors.telefono : ""
            }
          />

          <Input
            value={values.username}
            name="username"
            id="username"
            onChange={handleChange}
            onBlur={handleBlur}
            type="email"
            label="Correo"
            autoComplete="true"
            isInvalid={touched.username && errors.username}
            errorMessage={
              touched.username && errors.username ? errors.username : ""
            }
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
    </>
  )
}
