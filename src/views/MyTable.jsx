import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  CircularProgress,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Pagination,
} from "@nextui-org/react"

import { SearchIcon } from "../assets/icons/SearchIcon"
import { PlusIcon } from "../assets/icons/PlusIcon"
import { VerticalDotsIcon } from "../assets/icons/VerticalDotsIcon"

import { useAuth } from "../hooks/useAuth"
import { useEffect, useState, useMemo, useCallback } from "react"
import axios from "axios"
const API_URL = import.meta.env.VITE_API_URL

export function MyTable() {
  const { token, loading } = useAuth()
  const [filterValue, setFilterValue] = useState("")
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [loadingData, setLoadingData] = useState(true)

  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [streetSelected, setStreetSelected] = useState(null)

  const hasSearchFilter = Boolean(filterValue)
  const filteredItems = useMemo(() => {
    let filteredData = [...data]

    if (hasSearchFilter) {
      filteredData = filteredData.filter((data) =>
        data.calle.toLowerCase().includes(filterValue.toLowerCase()),
      )
    }

    return filteredData
  }, [data, filterValue, hasSearchFilter])

  const pages = Math.ceil(filteredItems.length / limit)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/calle/buscar-todas`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setData(response.data)
        setLoadingData(false)
      } catch (error) {
        // Manejar errores aquí
      }
    }
    fetchData()
  }, [page, limit, token])

  const items = useMemo(() => {
    const start = (page - 1) * limit
    const end = start + limit

    return filteredItems.slice(start, end)
  }, [page, limit, filteredItems])

  const onSearchChange = useCallback((value) => {
    if (value) {
      setFilterValue(value)
      setPage(1)
    } else {
      setFilterValue("")
    }
  }, [])

  const onClear = useCallback(() => {
    setFilterValue("")
    setPage(1)
  }, [])

  const handleModalOpen = (street) => {
    onOpen()
    setStreetSelected(street)
  }

  if (loading) {
    return (
      <div className="flex w-full justify-center">
        <CircularProgress
          size="sm"
          aria-label="Cargando..."
        />
      </div>
    )
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Eliminar Calle</ModalHeader>
              <ModalBody className="flex flex-col gap-1">
                <div className="text-center">
                  ¿Esta seguro/a que desea eliminar la calle{" "}
                  <span className="font-bold">{streetSelected.calle}</span>?
                </div>
              </ModalBody>
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
                  onPress={() => {
                    onClose
                  }}
                >
                  Eliminar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          {/* BUSCADOR */}
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
        </div>
        <Table
          aria-label="Tabla de datos"
          loading={loadingData}
          emptyText="No hay datos"
          data={data}
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                loop
                showShadow
                color="secondary"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            </div>
          }
        >
          <TableHeader>
            <TableColumn>ID</TableColumn>
            <TableColumn>Nombre</TableColumn>
            <TableColumn align="center">Acciones</TableColumn>
          </TableHeader>
          <TableBody emptyContent={"No se encontraron resultados"}>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.calle}</TableCell>
                <TableCell>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                      >
                        <VerticalDotsIcon />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Acciones">
                      <DropdownItem
                        key="delete"
                        className="text-danger"
                        color="danger"
                        onPress={() => handleModalOpen(item)} // abrir modal
                      >
                        Delete
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
