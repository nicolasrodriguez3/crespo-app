import { Button, Card, CardBody, CardFooter, Image } from "@nextui-org/react"
import { useAuth } from "../hooks/useAuth"
import { Link, useNavigate } from "react-router-dom"
import { HomeHeader } from "../components/HomeHeader"
import { Outlet } from "react-router-dom"
import imgCalles from "../assets/imgs/img-calle.jpg"
import imgUsuarios from "../assets/imgs/img-users.jpg"
import imgBarrios from "../assets/imgs/img-barrio2.jpg"
import imgAreas from "../assets/imgs/img-areas.jpg"

const functionsButtons = [
  { title: "Usuarios", img: imgUsuarios, to: "/usuarios" },
  { title: "Calles", img: imgCalles, to: "/calles" },
  { title: "Barrios", img: imgBarrios, to: "/barrios" },
  { title: "Áreas", img: imgAreas, to: "/areas" },
]

export function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()

  if (user?.roles.includes("JEFE")) {
    return (
      <>
        <HomeHeader />
        <div className="flex min-h-screen w-full flex-col items-center bg-gray-50 pb-16">
          <div className="flex w-full flex-col items-center justify-center gap-4 pt-4">
            <p className="text-center">
              Tu rol es de administrador, por lo que puedes acceder a la sección
              de administración.
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {functionsButtons.map(({ title, img, to }) => (
                <Card
                  key={title}
                  shadow="sm"
                  isPressable
                  as={Link}
                  to={to}
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
            <section className="max-w-sm">
              <Outlet />
            </section>
          </div>
        </div>
      </>
    )
  }

  if (user?.roles.includes("CAPATAZ")) {
    return (
      <>
        <HomeHeader />
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
      </>
    )
  }

  if (user?.roles.includes("EMPLEADO")) {
    return (
      <>
        <HomeHeader />
        <div className="flex min-h-screen w-full flex-col items-center bg-gray-50">
          <div className="flex w-full flex-col items-center justify-center gap-4 pt-4">
            <p className="text-center">
              Tu rol es de empleado, por lo que puedes acceder a la sección de
              administración.
            </p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <HomeHeader />
      <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col gap-4 pb-16 pt-4">
        <div className="flex flex-col gap-4">
          <Button
            as={Link}
            to="/add"
            className="rounded-md bg-gold font-bold"
          >
            Agregar reclamo
          </Button>
          <Button
            as={Link}
            to="/reclamos"
            variant="bordered"
            className="rounded-md border-gold"
          >
            Ver mis reclamos
          </Button>
        </div>
      </div>
    </>
  )
}
