import { Button, Input, Textarea, Select, SelectItem } from "@nextui-org/react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { v4 as uuidv4 } from "uuid"
import { Navbar } from "../components/Navbar"
import { CameraIcon } from "../assets/icons/CameraIcon"
import axios from "axios"
import { useAuth } from "../hooks/useAuth"
import { useEffect } from "react"
import { useState } from "react"
import { getCategories, getStreets, getnNeighborhoods } from "../helpers/getCategories"

export function AddClaim() {
  const [categories, setCategories] = useState([])
  const [streets, setStreets] = useState([])
  const [neighborhoods, setNeighborhoods] = useState([])

  const { user, token } = useAuth()

  useEffect(() => {
    getCategories(token).then((res) => setCategories(res.data))
    getStreets(token).then((res) => {
      //ordenar alfabeticamente los resultados
      res.data.sort((a, b) => {
        if (a.calle < b.calle) {
          return -1
        }
        if (a.calle > b.calle) {
          return 1
        }
        return 0
      })

      setStreets(res.data)
    })
    getnNeighborhoods(token).then((res) => setNeighborhoods(res.data))
  }, [token])

  const formik = useFormik({
    initialValues: {
      persona_id: user.id,
      content: "",
      tipoReclamo_id: new Set([]),
      calle_id: new Set([]),
      barrio_id: new Set([]),
      numberStreet: "",
      media: null,
    },
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      const { persona_id, tipoReclamo_id, content, calle_id, barrio_id, media } = values

      try {
        console.log({
          persona_id,
          tipoReclamo_id,
          calle_id,
          barrio_id,
          content,
          media,
        })
      } catch (error) {
        console.error(error)
        throw new Error("Error cargando los datos del post.")
      }
      //resetForm()
      setSubmitting(false)
    },
    validationSchema: Yup.object({
      tipoReclamo_id: Yup.string().required(
        "Por favor seleccione una categoría.",
      ),
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
            className="flex w-full max-w-xs flex-col gap-4 text-base"
          >
            <Select
              label="Tipo de reclamo"
              placeholder="Seleccione el tipo de reclamo"
              isRequired
              items={categories}
              className="max-w-xs"
              onSelectionChange={(val) =>
                setFieldValue("tipoReclamo_id", Array.from(val)[0])
              }
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

            <Textarea
              label="Descripción"
              labelPlacement="inside"
              isRequired
              placeholder="Ingrese una descripción"
              {...getFieldProps("content")}
            />

            {/* Calle */}
            <div className="grid grid-cols-[1fr_30%] gap-1">
            <Select
              label="Calle"
              placeholder="Seleccione la calle"
              items={streets}
              isRequired
              className="max-w-xs"
              onSelectionChange={(val) =>
                setFieldValue("calle_id", Array.from(val)[0])
              }
            >
              {(street) => (
                <SelectItem
                  key={street.id}
                  value={street.id}
                >
                  {street.calle}
                </SelectItem>
              )}
            </Select>
            <Input
              name="numberStreet"
              label="Altura"
              isRequired
              {...getFieldProps("numberStreet")}
              isInvalid={touched.numberStreet && errors.numberStreet}
              errorMessage={touched.numberStreet && errors.numberStreet ? errors.numberStreet : ""}
            />
            </div>

            <Select
              label="Barrio"
              placeholder="Seleccione el barrio"
              items={neighborhoods}
              className="max-w-xs"
              onSelectionChange={(val) =>
                setFieldValue("neighborhoods_id", Array.from(val)[0])
              }
            >
              {(neighborhood) => (
                <SelectItem
                  key={neighborhood.id}
                  value={neighborhood.id}
                >
                  {neighborhood.barrio}
                </SelectItem>
              )}
            </Select>

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
