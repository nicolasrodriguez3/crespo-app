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
} from "../helpers/CallsAPI"
import { validateFilename } from "../services/validateFilename"
import { GoogleMaps } from "../components/GoogleMaps"

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
    },
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      // subir la imagen, obtener su id y luego subir el reclamo
      const {
        persona_id,
        tipoReclamo_id,
        descripcion,
        calle_id,
        altura,
        barrio_id,
        imagen,
      } = values

      try {
        const claimData = {
          persona_id,
          tipoReclamo_id,
          descripcion,
          calle_id,
          altura,
          barrio_id,
        }
        console.log(claimData, values.coordenadas)

        // upload image
        const formData = new FormData()
        formData.append("file", imagen)

        const responseFile = await axios.put(
          `${API_URL}/archivo/guardar`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        )
        console.log(responseFile)
        const { id: imagen_id } = responseFile.data
        console.log(imagen_id)
        const claimDataWithFile = {
          ...claimData,
          imagen_id,
        }

        // TODO: realizar validaciones de los datos
        const response = await axios.put(
          `${API_URL}/reclamo`,
          claimDataWithFile,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        console.log(response)
        // TODO: mostrar mensaje de éxito
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
    <>
      <main className="flex min-h-screen w-full flex-col items-center">
        <div className="flex min-h-[200px]  w-full items-end justify-center bg-gradient-to-t from-[#ffcc00] to-gold py-12 text-2xl">
          Agregar reclamo
        </div>

        <section className="-mt-8 flex min-h-[40vh] w-full grow flex-col items-center gap-8 rounded-t-3xl bg-gray-50 py-4 pb-16">
          <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-xs flex-col gap-4 text-base"
          >
            <Select
              label="Tipo de reclamo"
              placeholder="Seleccione el tipo de reclamo"
              isRequired
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
              labelPlacement="inside"
              isRequired
              placeholder="Ingrese una descripción"
              {...getFieldProps("descripcion")}
            />

            {/* Calle */}
            <div className="grid grid-cols-[1fr_30%] gap-1">
              <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                isDismissable={false}
                scrollBehavior="inside"
              >
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader className="flex flex-col gap-1">
                        Calle
                      </ModalHeader>
                      <ModalBody>
                        <div className="flex flex-col justify-between px-1 py-2">
                          <Input
                            type="search"
                            placeholder="Buscar calle"
                            onChange={handleFilterStreet}
                          />
                          <div>
                            {filteredStreets &&
                              filteredStreets.length === 0 && (
                                <p className="text-sm text-gray-500">
                                  No se encontraron resultados
                                </p>
                              )}
                            <Listbox
                              aria-label="Actions"
                              onAction={(key) => {
                                setFieldValue("calle_id", key)
                                onClose()
                              }}
                            >
                              {filteredStreets.map((street) => (
                                <ListboxItem key={street.id}>
                                  {street.calle}
                                </ListboxItem>
                              ))}
                            </Listbox>
                          </div>
                        </div>
                      </ModalBody>
                    </>
                  )}
                </ModalContent>
              </Modal>
              <Button
                onPress={onOpen}
                color="default"
              >
                Calle
              </Button>
              <Input
                list="calles"
                label="Calle"
                placeholder="Seleccione la calle"
                isRequired
                onChange={handleStreetChange}
                isInvalid={touched.calle_id && errors.calle_id}
                errorMessage={
                  touched.calle_id && errors.calle_id ? errors.calle_id : ""
                }
              />
              <datalist id="calles">
                {streets.map((street) => (
                  <option
                    key={street.id}
                    value={street.calle}
                  />
                ))}
              </datalist>
              <Input
                name="altura"
                label="Altura"
                isRequired
                {...getFieldProps("altura")}
                isInvalid={touched.altura && errors.altura}
                errorMessage={
                  touched.altura && errors.altura ? errors.altura : ""
                }
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

            <div>
              <GoogleMaps
                setCenter={(e) => {
                  setFieldValue("coordenadas", e)
                }}
              />
            </div>

            <div>
              <Button
                color={fileError ? "danger" : "default"}
                variant="ghost"
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
        </section>
      </main>
      <Navbar />
    </>
  )
}
