import { Button, ButtonGroup, Input } from "@nextui-org/react"
import { useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Link, useNavigate } from "react-router-dom"
import { validateErrorOnAuth } from "../helpers/validateErrorOnAuth"
import google from "../assets/icons/google.svg"
import facebook from "../assets/icons/facebook.svg"
import { EyeFilledIcon } from "../assets/icons/EyeFilledIcon"
import { EyeSlashFilledIcon } from "../assets/icons/EyeSlashFilledIcon"

export function Login() {
  const navigate = useNavigate()
  const { login, loginWithGoogle, loginWithFacebook } = useAuth()
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
        await login(values.email, values.password)
        setSubmitting(false)
        navigate("/")
      } catch (err) {
        setSubmitting(false)
        const errorMsg = validateErrorOnAuth(err.code)
        setError(errorMsg)
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
    <main className="login_form flex min-h-screen w-full flex-col items-center gap-4 bg-gradient-to-b from-[#FFD73A] from-10% to-50%">
      <div className="flex grow items-end justify-center">
        <img
          src="/chicken.svg"
          alt="Logo de la app"
          width={100}
        />
      </div>
      <section className="flex min-h-[40vh] flex-col items-center gap-8 pb-8">
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-xs flex-col gap-4"
        >
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
            validationState={
              touched.email && errors.email ? "invalid" : "valid"
            }
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
            validationState={
              touched.password && errors.password ? "invalid" : "valid"
            }
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
            Iniciar sesión
          </Button>
        </form>
        <section>
          <p className="mb-2 text-center">o iniciar sesión con</p>
          <ButtonGroup>
            <Button
              className="h-12 bg-inherit"
              onClick={handleGoogleSignin}
            >
              <img
                src={google}
                width={40}
              />
            </Button>
            <Button
              className="h-12 bg-inherit"
              onClick={handleFacebookSignin}
            >
              <img
                src={facebook}
                width={40}
              />
            </Button>
          </ButtonGroup>
        </section>
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
