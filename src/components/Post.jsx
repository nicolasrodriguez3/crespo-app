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
  Accordion,
  AccordionItem,
} from "@nextui-org/react"

import { useEffect } from "react"

const API_IMAGES_URL = import.meta.env.VITE_API_IMAGES_URL

export function Post({ post }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const {
    id,
    imagen,
    seguimiento,
    descripcion,
    direccion,
    nombrePersona,
    tipoReclamo,
  } = post

  console.log(post)

  const handleOpen = () => {
    if (!isOpen) onOpen()
  }

  return (
    <>
      <Card
        className="w-full py-4"
        isPressable
        onClick={() => handleOpen()}
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
              alt="Card background"
              className="rounded-xl object-cover"
              src={`${API_IMAGES_URL}${imagen.path}/${imagen.nombre}`}
              width="100%"
            />
          ) : (
            <div className="flex flex-col">
              <h3>Reclamo de: {nombrePersona}</h3>
              <p>{descripcion}</p>
              <p className="text-sm text-gray-900">{direccion}</p>
            </div>
          )}
        </CardBody>
      </Card>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Seguimiento reclamo #{id}
              </ModalHeader>
              <ModalBody>
                <p>{descripcion}</p>
                <div>
                  <Accordion>
                    <AccordionItem
                      key="1"
                      aria-label="Accordion 1"
                      subtitle={seguimiento[0].descripcion}
                      title={`Estado: ${seguimiento[0].estado.replace(
                        "_",
                        " ",
                      )}`}
                    >
                      {seguimiento.map(({ estado, id, descripcion }, i) => {
                        if (i === 0) return
                        return (
                          <div key={id}>
                            <p className="font-bold">
                              Estado: {estado.replace("_", " ")}
                            </p>
                            {descripcion && (
                              <p className="">Descripción: {descripcion}</p>
                            )}
                          </div>
                        )
                      })}
                    </AccordionItem>
                  </Accordion>
                </div>
                <p>
                  Reclamo presentado por:{" "}
                  <span>
                    {nombrePersona}
                    {/* //todo agregar link al perfil de la persona */}
                  </span>
                </p>
                <p>Tipo de reclamo: {tipoReclamo}</p>
                <p>Dirección: {direccion}</p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                >
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={onClose}
                >
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
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
