import { Button, Card, CardBody, CardFooter, Image } from "@nextui-org/react"
import { useAuth } from "../hooks/useAuth"
import { Link, useNavigate } from "react-router-dom"
import { WrapperUI } from "../components/WrapperUI"

import imgCalles from "../assets/imgs/img-calle.jpg"
import imgUsuarios from "../assets/imgs/img-users2.jpg"
import imgBarrios from "../assets/imgs/img-barrio2.jpg"
import imgAreas from "../assets/imgs/img-areas.jpg"
import imgAgregar from "../assets/imgs/add-claim2.jpeg"
import imgReclamos from "../assets/imgs/add-claim.jpeg"
import imgTipoReclamos from "../assets/imgs/img-areas2.jpg"

const functionsButtons = [
  { title: "Ver reclamos", img: imgReclamos, to: "/lista-de-reclamos" },
  { title: "Mis reclamos", img: imgAgregar, to: "/reclamos" },
  { title: "Usuarios", img: imgUsuarios, to: "/usuarios" },
  { title: "Calles", img: imgCalles, to: "/calles" },
  { title: "Barrios", img: imgBarrios, to: "/barrios" },
  { title: "Áreas", img: imgAreas, to: "/areas" },
  { title: "Tipos de reclamos", img: imgTipoReclamos, to: "/tipos-de-reclamos" },
]

export function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const name = user?.nombre.split(" ")[0] || "usuario"

  if (user?.roles.includes("JEFE")) {
    return (
      <WrapperUI>
        <div className="flex w-full flex-col items-center justify-center gap-4 pt-4">
          <h2 className="">¡Bienvenido{`, ${name}`}!</h2>
          <div className="grid w-full grid-cols-2 gap-2">
            {functionsButtons.map(({ title, img, to }) => (
              <Card
                key={title}
                shadow="sm"
                isPressable
                as={Link}
                to={to}
                className="first:col-span-2"
              >
                <CardBody className="overflow-visible p-0">
                  <Image
                    shadow="sm"
                    radius="lg"
                    width="100%"
                    alt=""
                    className="h-[140px] w-full object-cover"
                    src={img}
                  />
                </CardBody>
                <CardFooter className="justify-between text-small">
                  <b>{title}</b>
                  <p className="text-default-500"></p>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </WrapperUI>
    )
  }

  if (user?.roles.includes("CAPATAZ")) {
    return (
      <WrapperUI>
        <div className="flex min-h-screen w-full flex-col items-center bg-gray-50">
          <div className="flex w-full flex-col items-center justify-center gap-4 pt-4">
            <p className="text-center">
              Tu rol es de capataz, por lo que puedes acceder a la sección de
              administración.
            </p>
            <button
              className="rounded-md bg-gold px-4 py-2 text-white"
              onClick={() => navigate("/admin")}
            >
              Ir a la sección de administración
            </button>
          </div>
        </div>
      </WrapperUI>
    )
  }

  if (user?.roles.includes("EMPLEADO")) {
    return (
      <WrapperUI>
        <div className="flex min-h-screen w-full flex-col items-center bg-gray-50">
          <div className="flex w-full flex-col items-center justify-center gap-4 pt-4">
            <p className="text-center">
              Tu rol es de empleado, por lo que puedes acceder a la sección de
              administración.
            </p>
          </div>
        </div>
      </WrapperUI>
    )
  }

  return (
    <WrapperUI>
      <h2 className="">¡Bienvenido{`, ${name}`}!</h2>
      <div className="flex flex-col gap-4">
        <Card
          shadow="sm"
          isPressable
          as={Link}
          to={"/add"}
        >
          <CardBody className="overflow-visible p-0">
            <Image
              shadow="sm"
              radius="lg"
              width="100%"
              alt=""
              className="h-[140px] w-full object-cover"
              src={imgAgregar}
            />
          </CardBody>
          <CardFooter className="justify-between text-small">
            <b>Agregar reclamo</b>
            <p className="text-default-500"></p>
          </CardFooter>
        </Card>

        <Button
          as={Link}
          to="/reclamos"
          variant="bordered"
          className="rounded-md border-gold"
        >
          Ver mis reclamos
        </Button>
      </div>
    </WrapperUI>
  )
}
