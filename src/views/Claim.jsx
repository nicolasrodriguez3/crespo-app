import axios from "axios"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { WrapperUI } from "../components/WrapperUI"
import {
  CircularProgress,
  Select,
  SelectItem,
  Input,
  Button,
} from "@nextui-org/react"
import { useFormik } from "formik"
import { claimStatus } from "../constants/claimStatus"

const API_URL = import.meta.env.VITE_API_URL

function Claim() {
  const { token, user } = useAuth()
  const { id } = useParams()
  const [claim, setClaim] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Fetch claim details from API
    const fetchClaim = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/reclamo/buscar-por-id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        if (response.status !== 200)
          throw new Error("Error al obtener el reclamo")

        const post = response.data
        const mappedPost = {
          id: post.id,
          descripcion: post.descripcion,
          direccion: `${post.calle.calle} ${post.altura}`,
          tipoReclamo: post.tipoReclamo.tipo,
          nombrePersona: post.persona.nombre,
          imagen: post.imagen,
          idSeguimiento: post.seguimiento.id,
          seguimiento: post.seguimiento.estados,
          creado: new Date(post.creada).toLocaleString(),
        }

        console.log(mappedPost)
        setClaim(mappedPost)
      } catch (error) {
        console.log(error)
        if (error.response.status === 404) {
          setError("Reclamo no encontrado")
        } else {
          setError("Error al obtener el reclamo")
        }
      }
    }

    fetchClaim()
  }, [id, token])

  const formik = useFormik({
    initialValues: {
      estado: "EN_CURSO",
      descripcion: "",
    },
    onSubmit: (values, { setSubmitting }) => {
      axios
        .post(
          `${API_URL}/seguimiento/agregar-estado-reclamo/${claim.idSeguimiento}`,
          {
            estado: values.estado,
            descripcion: values.descripcion,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then((res) => {
          console.log(res)
          setClaim((prev) => ({
            ...prev,
            seguimiento: [
              {
                estado: values.estado,
                descripcion: values.descripcion,
              },
              ...prev.seguimiento,
            ],
          }))
        })
        .catch((err) => console.log(err))
        .finally(() => setSubmitting(false))
    },
  })

  if (error) {
    return (
      <WrapperUI
        title={`Reclamo #${id}`}
        backTo="/lista-de-reclamos"
      >
        <div className="flex justify-center">
          <p className="text-center">{error}</p>
        </div>
      </WrapperUI>
    )
  }

  return (
    <WrapperUI
      title={`Reclamo #${id}`}
      backTo="/lista-de-reclamos"
    >
      {claim ? (
        <div>
          <h3 className="text-lg font-semibold leading-none text-gray-900">
            {claim.tipoReclamo}
          </h3>
          <time
            title="Fecha de creación"
            className="text-sm font-normal leading-none text-gray-400"
          >
            {claim.creado}
          </time>
          <p className="mb-4 text-base font-normal text-gray-600">
            {claim.descripcion}
          </p>
          {/* Seguimiento */}
          <ol className="relative border-l border-gray-200">
            {claim.seguimiento.map((estado) => (
              <li
                key={estado.id || estado.estado}
                className="mb-10 ml-4"
              >
                <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-200"></div>

                <h4 className="text-sm font-semibold leading-none text-gray-900">
                  {estado.estado.replace("_", " ")}
                </h4>
                <time
                  title="Fecha de creación"
                  className="text-xs font-normal leading-none text-gray-400"
                >
                  {estado.creada
                    ? new Date(estado.creada).toLocaleString()
                    : ""}
                </time>
                <p className="mb-4 text-xs font-normal text-gray-600">
                  {estado.descripcion}
                </p>
              </li>
            ))}
          </ol>

          {/* Dar seguimiento al reclamo */}
          {user.roles.includes("CAPATAZ") && (
            <div className="mt-4">
              <h4 className="mb-2 font-semibold text-gray-900">
                Dar seguimiento
              </h4>
              <form onSubmit={formik.handleSubmit}>
                <Select
                  label="Estado"
                  placeholder="Estado"
                  className="mb-4"
                  name="estado"
                  isRequired
                  onChange={formik.handleChange}
                  value={formik.values.estado}
                  selectedKeys={[formik.values.estado]}
                >
                  {claimStatus.map(({ status, label }) => (
                    <SelectItem
                      key={status}
                      value={status}
                    >
                      {label}
                    </SelectItem>
                  ))}
                </Select>
                <Input
                  isRequired
                  label="Descripción"
                  placeholder="Descripción"
                  className="mb-4"
                  name="descripcion"
                  onChange={formik.handleChange}
                  value={formik.values.descripcion}
                />
                <Button
                  className="bg-gold font-semibold"
                  variant="flat"
                  type="submit"
                  isLoading={formik.isSubmitting}
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
                  Guardar
                </Button>
              </form>
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-center">
          <CircularProgress label={`Cargando reclamo #${id}`} />
        </div>
      )}
    </WrapperUI>
  )
}

export default Claim
