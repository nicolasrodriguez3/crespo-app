import PropTypes from "prop-types"
import {
  Card,
  CardHeader,
  CardBody,
  Image,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react"

import { useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import { Link } from "react-router-dom"
import { CardFooter } from "@nextui-org/react"

const API_IMAGES_URL = import.meta.env.VITE_API_IMAGES_URL

export function Post({ post, handleOpen }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
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
        <CardBody className="px-3 pt-2">
          <p className="">
            {descripcion.length > 100
              ? `${descripcion.slice(0, 100)}...`
              : descripcion}
          </p>
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
  data: PropTypes.shape({
    altura: PropTypes.string,
    barrio: PropTypes.shape({
      barrio: PropTypes.string,
      id: PropTypes.string,
    }),
    calle: PropTypes.shape({
      calle: PropTypes.string,
      id: PropTypes.string,
    }),
    descripcion: PropTypes.string,
    id: PropTypes.string,
    imagen: PropTypes.string,
    seguimiento: PropTypes.shape({
      estados: PropTypes.arrayOf(
        PropTypes.shape({
          estado: PropTypes.string,
          descripcion: PropTypes.string,
          id: PropTypes.string,
        }),
      ),
    }),
    tipoReclamo: PropTypes.shape({
      id: PropTypes.string,
      tipo: PropTypes.string,
    }),
  }),
}
