import { Button, Card, CardBody, CardFooter, Image } from "@nextui-org/react"
import { useAuth } from "../hooks/useAuth"
import { Link } from "react-router-dom"
import { WrapperUI } from "../components/WrapperUI"

import imgCalles from "../assets/imgs/img-calle.jpg"
import imgUsuarios from "../assets/imgs/img-users2.jpg"
import imgBarrios from "../assets/imgs/img-barrio2.jpg"
import imgAreas from "../assets/imgs/img-areas.jpg"
import imgAgregar from "../assets/imgs/add-claim2.jpeg"
import imgReclamos from "../assets/imgs/add-claim.jpeg"
import imgTipoReclamos from "../assets/imgs/img-areas2.jpg"

const functionsButtons = [
  {
    title: "Ver reclamos",
    img: imgReclamos,
    to: "/lista-de-reclamos",
    rol: "EMPLEADO",
  },
  {
    title: "Mis reclamos",
    img: imgAgregar,
    to: "/reclamos",
    rol: "CONTRIBUYENTE",
  },
  { title: "Usuarios", img: imgUsuarios, to: "/usuarios", rol: "CAPATAZ" },
  { title: "Calles", img: imgCalles, to: "/calles", rol: "CAPATAZ" },
  { title: "Barrios", img: imgBarrios, to: "/barrios", rol: "CAPATAZ" },
  { title: "Áreas", img: imgAreas, to: "/areas", rol: "CAPATAZ" },
  {
    title: "Tipos de reclamos",
    img: imgTipoReclamos,
    to: "/tipos-de-reclamos",
    rol: "CAPATAZ",
  },
]

export function Home() {
  const { user } = useAuth()
  const name = user?.nombre.split(" ")[0] || "usuario"

  return (
    <WrapperUI>
      <div className="flex w-full flex-col items-center justify-center gap-4 pt-4">
        <h2 className="">¡Bienvenido{`, ${name}`}!</h2>
        {/* Solo contribuyentes */}
        {!user?.roles.includes("EMPLEADO") ? (
          <div className="flex w-full flex-col gap-4">
            <Card
              shadow="sm"
              isPressable
              as={Link}
              to={"/nuevo"}
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
              </CardFooter>
            </Card>

            <Button
              as={Link}
              to="/reclamos"
              color="default"
              variant="bordered"
              className="rounded-md border-gold font-semibold"
            >
              Ver mis reclamos
            </Button>

            {/* Agregar botón para instalar la app */}
          </div>
        ) : (
          <div className="grid w-full grid-cols-2 gap-2">
            {functionsButtons.map(({ title, img, to, rol }) => {
              if (!user?.roles.includes(rol)) return null
              return (
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
              )
            })}
          </div>
        )}
      </div>
    </WrapperUI>
  )
}
