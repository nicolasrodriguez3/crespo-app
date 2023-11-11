import { useParams } from "react-router-dom"
import { Button, Input } from "@nextui-org/react"
import { WrapperUI } from "../components/WrapperUI"

const data = {
  calle: {
    name: "Calle",
    prevUrl: "/calles",
    fields: [
      {
        name: "Nombre de la calle",
        type: "text",
        placeholder: "Ej: San Martín",
      },
    ],
  },
  barrio: {
    name: "Nombre del barrio",
    fields: [{ name: "Nombre", type: "text", placeholder: "Ej: Centro" }],
  },
  area: {
    name: "Nombre del área",
    fields: [{ name: "Nombre", type: "text", placeholder: "Ej: Tránsito" }],
  },
  "tipo-de-reclamo": {
    name: "Nuevo tipo de reclamo",
    fields: [{ name: "Nombre", type: "text", placeholder: "Ej: Salud Animal" }],
  },
}

function AddNew() {
  const { instance } = useParams()

  return (
    <WrapperUI
      title={`Agregar ${data[instance].name}`}
      backTo={data[instance].prevUrl || "/"}
    >
      <form className="flex flex-col gap-2">
        {data[instance]?.fields.map(({ name }) => (
          <div key={name}>
            <Input
              name={name}
              label={name}
            />
          </div>
        ))}
        <div>
          <Button type="submit">Agregar</Button>
        </div>
      </form>
    </WrapperUI>
  )
}
export default AddNew
