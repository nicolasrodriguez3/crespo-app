import { useParams } from "react-router-dom"
import { Button, Input } from "@nextui-org/react"
import { WrapperUI } from "../components/WrapperUI"
import { useFormik } from "formik"
import { createInstance } from "../services/createInstance"
import { useAuth } from "../hooks/useAuth"
import toast from "react-hot-toast"

const API_URL = import.meta.env.VITE_API_URL

const data = {
  calle: {
    name: "Calle",
    prevUrl: "/calles",
    apiUrl: `${API_URL}/calle`,
    fields: [
      {
        label: "Nombre de la calle",
        name: "calle",
        type: "text",
        placeholder: "Ej: San Martín",
      },
    ],
  },
  barrio: {
    name: "Barrio",
    prevUrl: "/barrios",
    apiUrl: `${API_URL}/barrio`,
    fields: [
      {
        name: "barrio",
        label: "Nombre del barrio",
        type: "text",
        placeholder: "Ej: Centro",
      },
    ],
  },
  area: {
    name: "Área",
    prevUrl: "/areas",
    apiUrl: `${API_URL}/area`,
    fields: [
      {
        name: "area",
        label: "Nombre del área",
        type: "text",
        placeholder: "Ej: Tránsito",
      },
    ],
  },
  "tipo-de-reclamo": {
    name: "Tipo de reclamo",
    prevUrl: "/tipos-de-reclamos",
    apiUrl: `${API_URL}/tipo-reclamo`,
    fields: [
      {
        name: "tipo",
        label: "Nombre del tipo de reclamo",
        type: "text",
        placeholder: "Ej: Salud Animal",
      },
    ],
  },
}

function AddNew() {
  const { instance } = useParams()
  const { token } = useAuth()

  const title = data[instance]
  const dataName = title.name
  const apiUrl = title.apiUrl

  const formik = useFormik({
    initialValues: {
      [title.fields[0].name]: "",
    },
    onSubmit: (values) => {
      const instance = { token, newData: values, url: apiUrl }
      toast.promise(createInstance(instance), {
        loading: `Agregando ${dataName.toLowerCase()}...`,
        success: `¡${dataName} agregado correctamente!`,
        error: "Error al agregar",
      })
      console.log(instance)
    },
  })

  return (
    <WrapperUI
      title={`Agregar ${title.name}`}
      backTo={title.prevUrl || "/"}
    >
      <form
        className="flex flex-col gap-3"
        onSubmit={formik.handleSubmit}
      >
        {title?.fields.map(({ name, label }) => (
          <div key={name}>
            <Input
              name={name}
              isRequired
              label={label}
              onChange={formik.handleChange}
              value={formik.values[name]}
            />
          </div>
        ))}
        <div>
          <Button
            type="submit"
            className="bg-gold font-semibold"
          >
            Agregar
          </Button>
        </div>
      </form>
    </WrapperUI>
  )
}
export default AddNew
