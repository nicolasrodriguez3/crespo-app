import { Card, CardBody, CardFooter, Image } from "@nextui-org/react"
import { useAuth } from "../hooks/useAuth"
import { Link } from "react-router-dom"
import { WrapperUI } from "../components/WrapperUI"
import { sections } from "../constants/homeSections"

import imgAgregar from "../assets/imgs/add-claim2.jpg"
import imgMisReclamos from "../assets/imgs/claim.jpg"

export default function Home() {
  const { user } = useAuth()
  const name = user?.nombre.split(" ")[0] || "usuario"
  const esContribuyente = !user?.roles.includes("EMPLEADO")

  return (
    <WrapperUI>
      <h2 className="">¡Bienvenido, {name}!</h2>
      {/* Solo contribuyentes */}
      {esContribuyente ? (
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
          <Card
            shadow="sm"
            isPressable
            as={Link}
            to={"/reclamos"}
          >
            <CardBody className="overflow-visible p-0">
              <Image
                shadow="sm"
                radius="lg"
                width="100%"
                alt=""
                className="h-[140px] w-full object-cover"
                src={imgMisReclamos}
              />
            </CardBody>
            <CardFooter className="justify-between text-small">
              <b>Mis reclamos</b>
            </CardFooter>
          </Card>
          <div className="grid grid-cols-2 gap-4">
            <Card
              shadow="sm"
              isPressable
              as={Link}
              to={"/telefonos"}
            >
              <CardFooter className="text-small">
                <b>Teléfonos utiles</b>
              </CardFooter>
            </Card>
            <Card
              shadow="sm"
              isPressable
              as={Link}
              to={"/tramites"}
            >
              <CardFooter className="text-small">
                <b>Guía de trámites</b>
              </CardFooter>
            </Card>
          </div>
        </div>
      ) : (
        <div className="grid w-full grid-cols-2 gap-2">
          {sections.map(({ title, img, to, rol }) => {
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
    </WrapperUI>
  )
}
