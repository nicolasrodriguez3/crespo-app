import {
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { CameraIcon } from "../assets/icons/CameraIcon"
import { useAuth } from "../hooks/useAuth"
import { useState, useEffect, useRef, useCallback } from "react"
import {
  getCategories,
  getStreets,
  getNeighborhoods,
  uploadImageAndSubmitClaim,
} from "../helpers/api"
import { validateFilename } from "../services/validateFilename"
import { GoogleMaps } from "../components/GoogleMaps"
import { WrapperUI } from "../components/WrapperUI"
import toast from "react-hot-toast"
import Loader from "../assets/icons/Loader"
import { useNavigate } from "react-router-dom"
import { CloseIcon } from "../assets/icons/CloseIcon"

export default function AddClaim() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [streets, setStreets] = useState([])
  const [neighborhoods, setNeighborhoods] = useState([])
  const [error, setError] = useState(false)

  const imgRef = useRef(null)

  const { user, token } = useAuth()

  useEffect(() => {
    getCategories(token).then((res) => setCategories(res.data))
    getStreets(token).then((res) => {
      //ordenar alfabéticamente los resultados
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
    getNeighborhoods(token).then((res) => setNeighborhoods(res.data))
  }, [token])

  const formik = useFormik({
    initialValues: {
      persona_id: user?.id,
      descripcion: "",
      tipoReclamo_id: new Set([]),
      calle_id: "",
      barrio_id: new Set([]),
      altura: "",
      imagen: null,
      coordenadas: { lat: -32.031, lng: -60.307 },
      imagen_id: "",
    },
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      setError(false)
      // subir la imagen, obtener su id y luego subir el reclamo
      const {
        persona_id,
        tipoReclamo_id,
        descripcion,
        calle_id,
        altura,
        barrio_id,
        coordenadas,
        imagen,
      } = values

      try {
        const claimData = {
          persona_id,
          tipoReclamo_id,
          descripcion: descripcion.trim(),
          calle_id,
          altura: altura.toString().padStart(3, "0"),
          barrio_id: barrio_id ? Array.from(barrio_id)[0] : null,
          coordinadaX: coordenadas.lat,
          coordinadaY: coordenadas.lng,
        }

        console.log(claimData)

        const response = await toast.promise(
          uploadImageAndSubmitClaim({ imagen, token, data: claimData }),
          {
            loading: "Creando reclamo...",
            success: ({ data }) =>
              `Reclamo creado con éxito. Número de reclamo: ${data.id}`,
            error: "Error al crear el reclamo.",
          },
          {
            style: {
              minWidth: "250px",
            },
          },
        )

        console.log(response)

        // validate response
        if (response.status !== 201) {
          throw new Error("Error al crear el reclamo")
        }

        navigate("/reclamos")
      } catch (error) {
        console.error(error)
        setError("Error al crear el reclamo")
      }

      setSubmitting(false)
    },
    validationSchema: Yup.object({
      tipoReclamo_id: Yup.string().required(
        "Por favor seleccione el tipo de reclamo.",
      ),
      descripcion: Yup.string().required(
        "Por favor agregue una descripción del reclamo.",
      ),
    }),
  })

  const {
    values,
    touched,
    errors,
    isSubmitting,
    setFieldValue,
    handleSubmit,
    getFieldProps,
  } = formik

  const clearImage = () => {
    setFieldValue("imagen", null)
    setError(null) // Limpiar el error al eliminar la imagen
  }

  const handleFileChange = useCallback(
    (e) => {
      const file = e.target.files[0]
      if (!file) return

      if (validateFilename(file.name)) {
        setFieldValue("imagen", file)
        setError(null)
      } else {
        toast.error("Extensión del archivo no permitida")
        setError("Extensión del archivo no permitida")
        setFieldValue("imagen", null)
      }
    },
    [setFieldValue],
  )

  return (
    <WrapperUI title="Agregar reclamo">
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-4 text-base"
      >
        <Select
          label="Tipo de reclamo"
          placeholder="Seleccione el tipo de reclamo"
          isRequired
          name="tipoReclamo_id"
          isInvalid={touched.tipoReclamo_id && errors.tipoReclamo_id}
          errorMessage={
            touched.tipoReclamo_id && errors.tipoReclamo_id
              ? errors.tipoReclamo_id
              : ""
          }
          items={categories}
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
          name="descripcion"
          labelPlacement="inside"
          isRequired
          placeholder="Ingrese una descripción"
          isInvalid={touched.descripcion && errors.descripcion}
          errorMessage={
            touched.descripcion && errors.descripcion ? errors.descripcion : ""
          }
          {...getFieldProps("descripcion")}
        />

        {/* Calle */}
        <div className="grid grid-cols-[1fr_30%] gap-1">
          <Autocomplete
            defaultItems={streets}
            label="Calle"
            isRequired
            selectedKey={values.calle_id}
            onSelectionChange={(e) => {
              setFieldValue("calle_id", e)
            }}
          >
            {(street) => (
              <AutocompleteItem key={street.id}>
                {street.calle}
              </AutocompleteItem>
            )}
          </Autocomplete>
          <Input
            name="altura"
            label="Altura"
            pattern="[0-9]{1,4}"
            isRequired
            {...getFieldProps("altura")}
            isInvalid={touched.altura && errors.altura}
            errorMessage={touched.altura && errors.altura ? errors.altura : ""}
          />
        </div>
        <Select
          label="Barrio"
          placeholder="Seleccione el barrio"
          items={neighborhoods}
          onSelectionChange={(val) =>
            setFieldValue("barrio_id", Array.from(val)[0])
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

        <div className="overflow-hidden rounded-medium">
          <GoogleMaps
            setCenter={(e) => {
              setFieldValue("coordenadas", e)
            }}
          />
        </div>

        <div className="flex items-center justify-start gap-2 ">
          <Button
            color="default"
            variant="flat"
            className="shrink-0"
            endContent={<CameraIcon size="24px" />}
            onClick={() => imgRef.current.click()}
          >
            Adjuntar una foto
          </Button>
          {/* imagen name */}
          {values.imagen && (
            <p className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-gray-500">
              {values.imagen.name}
            </p>
          )}
        </div>
        <input
          ref={imgRef}
          type="file"
          name="imagen"
          id="imagen"
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {values.imagen ? (
          <div className="relative">
            {/* Delete image button */}
            <Button
              isIconOnly
              color="default"
              aria-label="Eliminar imagen"
              className="absolute right-1 top-1 rounded-full bg-transparent"
              onClick={clearImage}
            >
              <CloseIcon
                size="40px"
                fill="#fff"
              />
            </Button>

            {/* Image preview */}
            <img
              className="block rounded-lg"
              src={URL.createObjectURL(values.imagen)}
            />
          </div>
        ) : (
          ""
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button
          type="submit"
          className="bg-gold font-semibold"
          isLoading={isSubmitting}
          spinner={<Loader />}
        >
          Cargar reclamo
        </Button>
      </form>
    </WrapperUI>
  )
}
