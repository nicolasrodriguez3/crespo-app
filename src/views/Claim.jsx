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
import { hasPermission } from "../services/hasPermission"
import Loader from "../assets/icons/Loader"
import toast from "react-hot-toast"
import { sortArray } from "../helpers/sortArray"

const API_URL = import.meta.env.VITE_API_URL

function Claim() {
  const { token, user } = useAuth()
  const { id } = useParams()
  const [claim, setClaim] = useState(null)
  const [error, setError] = useState(null)

  const claimClosed = claim?.seguimiento.some(
    ({ estado }) => estado === "RECHAZADO" || estado === "RESUELTO",
  )

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
          seguimiento: sortArray(post.seguimiento.estados, "id", "desc"),
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
      toast.promise(
        new Promise((resolve, reject) =>
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
                seguimiento: res.data.estados,
              }))
              resolve("Estado agregado correctamente")
            })
            .catch((err) => {
              console.log(err)
              setError("Error al agregar estado")
              reject("Error al agregar estado")
            })
            .finally(() => setSubmitting(false)),
        ),
        {
          loading: "Agregando estado...",
          success: (msg) => msg,
          error: (msg) => msg,
        },
      )
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
        <div className="flex flex-col gap-4">
          <div>
            <time
              title="Fecha de creación"
              className="font-normal leading-none text-gray-500"
            >
              {claim.creado}
            </time>
            <p>
              <span className="font-semibold text-gray-900">
                {claim.nombrePersona}
              </span>{" "}
              reportó un reclamo en{" "}
              <span className="font-semibold text-gray-900">
                {claim.direccion}
              </span>
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold leading-none text-gray-900">
              Categoria: {claim.tipoReclamo}
            </h3>
            <p className="text-base font-normal text-gray-600">
              {claim.descripcion}
            </p>
          </div>
          <div className="mt-2">
            {/* Seguimiento */}
            <ol className="relative border-l border-gray-200">
              {claim.seguimiento.map((estado) => (
                <li
                  key={estado.id || estado.estado}
                  className="mb-10 ml-4"
                >
                  <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-200"></div>

                  <h4 className="font-semibold leading-none text-gray-900">
                    {estado.estado.replace("_", " ")}
                  </h4>
                  <time
                    title="Fecha de creación"
                    className="text-sm font-normal leading-none text-gray-400"
                  >
                    {estado.creada
                      ? new Date(estado.creada).toLocaleString()
                      : ""}
                  </time>
                  <p className="mb-4 text-sm font-normal text-gray-600">
                    {estado.descripcion}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          {/* Dar seguimiento al reclamo */}
          {hasPermission({
            section: "seguimiento",
            action: "agregar",
            roles: user.roles,
          }) && (
            <div className="mt-4">
              <h4 className="mb-2 font-semibold text-gray-900">
                Dar seguimiento
              </h4>
              {claimClosed ? (
                <p className="mb-4 text-sm font-normal text-gray-600">
                  El reclamo está cerrado, no se puede agregar más estados
                </p>
              ) : (
                <p className="mb-4 text-sm font-normal text-gray-600">
                  Agregue un nuevo estado al reclamo
                </p>
              )}

              <form onSubmit={formik.handleSubmit}>
                <Select
                  label="Estado"
                  placeholder="Estado"
                  className="mb-4"
                  name="estado"
                  isRequired
                  isDisabled={claimClosed}
                  onChange={formik.handleChange}
                  value={formik.values.estado}
                  selectedKeys={[formik.values.estado]}
                  disallowEmptySelection
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
                  isDisabled={claimClosed}
                  onChange={formik.handleChange}
                  value={formik.values.descripcion}
                />
                <Button
                  className="bg-gold font-semibold"
                  variant="flat"
                  type="submit"
                  isDisabled={claimClosed}
                  isLoading={formik.isSubmitting}
                  spinner={<Loader />}
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
