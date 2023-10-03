import { Button, Input } from "@nextui-org/react"
import { useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Link, useNavigate } from "react-router-dom"
import { EyeFilledIcon } from "../assets/icons/EyeFilledIcon"
import { EyeSlashFilledIcon } from "../assets/icons/EyeSlashFilledIcon"
import wave from "../assets/imgs/wave-top.svg"

export function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [isVisible, setIsVisible] = useState(false)

  const [error, setError] = useState(null)

  const formik = useFormik({
    initialValues: {
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
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setError(null)

      try {
        const user = await login(values.email, values.password)
        console.log(user)
        setSubmitting(false)
        //navigate("/")
      } catch (err) {
        console.error(err)
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
      <div className="flex min-h-[150px]  w-full items-center justify-center bg-gradient-to-t from-[#ffcc00] to-gold pt-8">
        <img
          src="/chicken.svg"
          alt="Logo de la app"
          width={80}
        />
      </div>
      <section className="relative flex min-h-[40vh] w-full flex-col items-center gap-8 pb-8 pt-20">
        <img
          src={wave}
          width={"100%"}
          className="absolute top-0 block h-24 w-full"
        />
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-xs flex-col gap-4 text-base"
        >
          <Input
            value={values.email}
            name="email"
            id="email"
            onChange={handleChange}
            onBlur={handleBlur}
            type="email"
            label="Correo"
            autoComplete="true"
            classNames={{
              input: "text-base",
            }}
            isInvalid={touched.email && errors.email}
            errorMessage={touched.email && errors.email ? errors.email : ""}
          />

          <Input
            value={values.password}
            label="Contraseña"
            name="password"
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

          <Link
            to="/forgot-password"
            className="mt-1 block text-right text-sm"
          >
            ¿Olvidaste tu contraseña?
          </Link>
          {error && <p className="text-red-400">{error.message}</p>}

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
            Iniciar sesión
          </Button>
        </form>

        <p>
          ¿No tienes una cuenta?{" "}
          <Link
            to="/register"
            className="underline"
          >
            Regístrate
          </Link>
        </p>
      </section>
    </main>
  )
}
