import PropTypes from "prop-types"
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Divider,
} from "@nextui-org/react"
import { useAuth } from "../hooks/useAuth"
import { Link } from "react-router-dom"
import UserIcon from "../assets/icons/UserIcon"
import LocationIcon from "../assets/icons/LocationIcon"
import AlertRhombusIcon from "../assets/icons/AlertRhombusIcon"

export function Post({ post, handleOpen }) {
  const { user } = useAuth()
  const isEmployee = user.roles.includes("EMPLEADO")

  const {
    id,
    imagen,
    seguimiento,
    descripcion,
    direccion,
    nombrePersona,
    tipoReclamo,
  } = post

  return (
    <>
      <Card
        className="w-full py-3"
        isPressable
        {...(isEmployee && {
          as: Link,
          to: `/reclamos/${id}`,
        })}
        {...(!isEmployee && {
          onClick: () => handleOpen(id),
        })}
      >
        <CardHeader className="flex-col items-start px-4 py-2">
          <p className="text-sm font-bold">
            Reclamo #{id} - {post.creado}
          </p>
          <h4 className="text-large font-bold">{tipoReclamo}</h4>
        </CardHeader>
        <Divider />
        <CardBody>
          {imagen && (
            <Image
              src={`${imagen.path}/${imagen.nombre}`}
              alt="Imagen del reclamo"
              width={400}
              height={200}
              className="mb-3 rounded-md"
            />
          )}
          <p className="flex items-baseline gap-1">
            <span>
              <AlertRhombusIcon width="1rem" />
            </span>

            {descripcion.length > 100
              ? `${descripcion.slice(0, 100)}...`
              : descripcion}
          </p>
          <p className="flex items-baseline gap-1">
            <span>
              <LocationIcon />
            </span>
            {direccion}
          </p>
          {isEmployee && (
            <p className="flex items-center gap-1 text-default-500">
              <span>
                <UserIcon />
              </span>
              {nombrePersona}
            </p>
          )}
        </CardBody>
        <CardFooter className="flex justify-between">
          <p className="text-default-500">
            Estado: {seguimiento[0].estado.replace("_", " ")}
            {seguimiento[0].creada && ` - ${seguimiento[0].creada}`}
          </p>
          <p className="text-sm">Ver mas info</p>
        </CardFooter>
      </Card>
    </>
  )
}

Post.propTypes = {
  post: PropTypes.object.isRequired,
  handleOpen: PropTypes.func,
}
