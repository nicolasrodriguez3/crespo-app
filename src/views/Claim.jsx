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

const API_URL = import.meta.env.VITE_API_URL

const claimStatus = [
  {
    status: "EN_CURSO",
    label: "En curso",
  },
  {
    status: "RESUELTO",
    label: "Resuelto",
  },
  {
    status: "PASE_SECTOR",
    label: "Pase de sector",
  },
  {
    status: "RECHAZADO",
    label: "Rechazado",
  },
]

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
    onSubmit: (values) => {
      console.log(values)
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
                key={estado.id}
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
                  color="secondary"
                  variant="flat"
                  type="submit"
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
