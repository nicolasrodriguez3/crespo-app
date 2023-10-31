import {
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Modal,
  Listbox,
  ListboxItem,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  ScrollShadow,
} from "@nextui-org/react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Navbar } from "../components/Navbar"
import { CameraIcon } from "../assets/icons/CameraIcon"
import axios from "axios"
import { useAuth } from "../hooks/useAuth"
import { useState, useEffect, useRef } from "react"
import {
  getCategories,
  getStreets,
  getNeighborhoods,
  uploadImage,
  submitClaim,
} from "../helpers/api"
import { validateFilename } from "../services/validateFilename"
import { GoogleMaps } from "../components/GoogleMaps"
import { WrapperUI } from "../components/WrapperUI"
import toast from "react-hot-toast"

const API_URL = import.meta.env.VITE_API_URL

export function AddClaim() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [categories, setCategories] = useState([])
  const [streets, setStreets] = useState([])
  const [neighborhoods, setNeighborhoods] = useState([])
  const [fileError, setFileError] = useState(false)
  const [filteredStreets, setFilteredStreets] = useState([...streets])

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
      setFilteredStreets(res.data)
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
      toast("Cargando...")
      // subir la imagen, obtener su id y luego subir el reclamo
      const {
        persona_id,
        tipoReclamo_id,
        descripcion,
        calle_id,
        altura,
        barrio_id,
        coordenadas,
      } = values

      const alturaValida = altura.padStart(3, "0")

      try {
        const claimData = {
          persona_id,
          tipoReclamo_id,
          descripcion,
          calle_id,
          altura: alturaValida,
          barrio_id,
          coordinadaX: coordenadas.lat,
          coordinadaY: coordenadas.lng,
        }

        console.log(claimData)
        if (!values.imagen_id) {
          const imagen = await uploadImage(imagen, token)
          setFieldValue("imagen_id", imagen)
        }

        const claimDataWithFile = {
          ...claimData,
          imagen_id: values.imagen_id,
        }

        const response = await submitClaim(claimDataWithFile, token)
        console.log(response)

        // validate response
        if (response.status !== 200) {
          throw new Error("Error cargando los datos del post.")
        }

        // TODO: mostrar mensaje de éxito
        toast("Reclamo cargado con éxito", {
          icon: "👏",
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

  const handleFilterStreet = (e) => {
    const street = e.target.value
    const filteredStreets = streets.filter((s) =>
      s.calle.toLowerCase().includes(street.toLowerCase()),
    )
    setFilteredStreets(filteredStreets)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (validateFilename(file.name)) {
      setFieldValue("imagen", file)
      setFileError(false)
    } else {
      setFileError("Extensión del archivo no permitida")

      //* ¿borrar la imagen del input?
      //setFieldValue("imagen", null)
    }
  }
  const handleStreetChange = (e) => {
    const street = e.target.value
    const streetId = streets.find((s) => s.calle === street)?.id
    console.log(streetId)
    if (!streetId) return
    setFieldValue("calle_id", streetId)
  }

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
          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            isDismissable={false}
            hideCloseButton={true}
            scrollBehavior="inside"
          >
            <ModalContent className="max-w-sm">
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Seleccione la calle
                  </ModalHeader>
                  <ModalBody>
                    <div className="flex flex-col justify-between">
                      <Input
                        type="search"
                        placeholder="Buscar calle"
                        onChange={handleFilterStreet}
                      />
                      <ScrollShadow className="max-h-[400px]">
                        {filteredStreets && filteredStreets.length === 0 && (
                          <p className="text-sm text-gray-500">
                            No se encontraron resultados
                          </p>
                        )}
                        <Listbox
                          aria-label="Actions"
                          onAction={(key) => {
                            setFieldValue("calle_id", key)
                            setFilteredStreets(streets)
                            onClose()
                          }}
                        >
                          {filteredStreets.map((street) => (
                            <ListboxItem key={street.id}>
                              {street.calle}
                            </ListboxItem>
                          ))}
                        </Listbox>
                      </ScrollShadow>
                    </div>
                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>
          <Input
            label="Calle"
            readOnly
            onClick={onOpen}
            value={
              values.calle_id
                ? streets.find((s) => s.id === values.calle_id)?.calle
                : ""
            }
            placeholder="Seleccione la calle"
            isRequired
            onChange={handleStreetChange}
            isInvalid={touched.calle_id && errors.calle_id}
            errorMessage={
              touched.calle_id && errors.calle_id ? errors.calle_id : ""
            }
          />
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

        <div>
          <Button
            color={fileError ? "danger" : "default"}
            variant="flat"
            endContent={<CameraIcon />}
            onClick={() => imgRef.current.click()}
          >
            Adjuntar una foto
          </Button>
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
        {fileError && <p className="text-sm text-red-500">{fileError}</p>}

        {values.imagen ? (
          <div className="relative">
            {/* Delete image button */}
            <Button
              isIconOnly
              color="default"
              aria-label="Like"
              className="absolute right-1 top-1 rounded-full"
              onClick={() => setFieldValue("imagen", null)}
            >
              <svg
                className="h-6 w-6"
                width="64px"
                height="64px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g
                  id="SVGRepo_bgCarrier"
                  strokeWidth="0"
                ></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M19.207 6.207a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 1 0 1.414 1.414L12 13.414l5.793 5.793a1 1 0 0 0 1.414-1.414L13.414 12l5.793-5.793z"
                    fill="currentColor"
                  ></path>
                </g>
              </svg>
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
    </WrapperUI>
  )
}
