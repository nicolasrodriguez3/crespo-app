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
        className="w-full py-4"
        isPressable
        {...(isEmployee && {
          as: Link,
          to: `/reclamos/${id}`,
        })}
        {...(!isEmployee && {
          onClick: () => handleOpen(id),
        })}
      >
        <CardHeader className="flex-col items-start px-4 pb-0 pt-2">
          <p className="text-tiny font-bold">Reclamo #{id}</p>
          <small className="text-default-500">
            Estado: {seguimiento[0].estado.replace("_", " ")}
          </small>
          <h4 className="text-large font-bold">{tipoReclamo}</h4>
        </CardHeader>
        <Divider />
        <CardBody className="overflow-visible py-2">
          {imagen !== null ? (
            <Image
              alt="Imagen del reclamo"
              className="rounded-xl object-cover"
              src={`${API_IMAGES_URL}${imagen.path}/${imagen.nombre}`}
              width="100%"
            />
          ) : (
            <div className="flex flex-col">
              { isEmployee && <h3>Reclamo de: {nombrePersona}</h3>}
              <p>{descripcion}</p>
              <p className="text-sm text-gray-900">{direccion}</p>
            </div>
          )}
        </CardBody>
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
