import axios from "axios"
import { useState, useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react"
import { VerticalDotsIcon } from "../assets/icons/VerticalDotsIcon"

const API_URL = import.meta.env.VITE_API_URL

export function StreetsList() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { user, token } = useAuth()
  const [streets, setStreets] = useState([])

  useEffect(() => {
    axios
      .get(`${API_URL}/calle/buscar-todas`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setStreets(res.data)
        console.log(res)
      })
  }, [token])

  return (
    <>
      <h2 className="font-bold">Streets List</h2>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                ¿Esta segura/o que desea eliminar esta calle?
              </ModalHeader>
              <ModalFooter>
                <Button
                  color="default"
                  variant="light"
                  onPress={onClose}
                >
                  Cancelar
                </Button>
                <Button
                  color="danger"
                  onPress={onClose}
                >
                  Eliminar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <ul className="w-full px-2">
        {streets.map((street) => (
          <li key={street.id} className="flex items-center justify-between">
            <span>{street.calle}</span>
            {user?.roles.includes("JEFE") && (
              <Dropdown>
                <DropdownTrigger>
                  {/* abrir menu */}
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                  >
                    <VerticalDotsIcon className="text-default-300" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions">
                  <DropdownItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                    onPress={onOpen} // abrir modal
                  >
                    Delete
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            )}
          </li>
        ))}
      </ul>
    </>
  )
}
