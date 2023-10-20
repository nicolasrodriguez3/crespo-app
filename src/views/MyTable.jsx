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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Pagination,
} from "@nextui-org/react"
import PropTypes from "prop-types"
import { SearchIcon } from "../assets/icons/SearchIcon"
import { PlusIcon } from "../assets/icons/PlusIcon"
import { VerticalDotsIcon } from "../assets/icons/VerticalDotsIcon"
import { useState, useMemo, useCallback } from "react"

export function MyTable({ theme = "dato", data }) {
  const [filterValue, setFilterValue] = useState("")
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [dataSelected, setDataSelected] = useState(null)

  const hasSearchFilter = Boolean(filterValue)
  const filteredItems = useMemo(() => {
    let filteredData = [...data]

    if (hasSearchFilter) {
      filteredData = filteredData.filter(({ data }) =>
        data.toLowerCase().includes(filterValue.toLowerCase()),
      )
    }

    return filteredData
  }, [data, filterValue, hasSearchFilter])

  const pages = Math.ceil(filteredItems.length / rowsPerPage)

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return filteredItems.slice(start, end)
  }, [page, rowsPerPage, filteredItems])

  const onSearchChange = useCallback((value) => {
    if (value) {
      setFilterValue(value)
      setPage(1)
    } else {
      setFilterValue("")
    }
  }, [])

  const onRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(Number(e.target.value))
    setPage(1)
  }, [])

  const onClear = useCallback(() => {
    setFilterValue("")
    setPage(1)
  }, [])

  const handleModalOpen = (street) => {
    onOpen()
    setDataSelected(street)
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
              <ModalHeader>Eliminar {theme}</ModalHeader>
              <ModalBody className="flex flex-col gap-1">
                <div className="text-center">
                  ¿Esta seguro/a que desea eliminar la entrada{" "}
                  <span className="font-bold">{dataSelected.data}</span>?
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
        <div className="flex justify-between gap-3">
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
          {/* BOTON AGREGAR */}
          <div>
            <Button
              color="secondary"
              endContent={<PlusIcon />}
            >
              Agregar {theme}
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-small text-default-400">
            Total {data.length} {data.length > 1 ? `${theme}s` : theme}
          </span>
          {/* FILAS POR PAGINA */}
          {data.length > 10 && (
            <label className="flex items-center text-small text-default-400">
              Filas por página
              <select
                className="bg-transparent text-small text-default-400 outline-none"
                onChange={onRowsPerPageChange}
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </label>
          )}
        </div>
        <Table
          aria-label="Tabla de datos"
          emptyText="No hay datos"
          data={data}
          bottomContent={
            pages > 1 && (
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
            )
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
                <TableCell>{item.data}</TableCell>
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
                        textValue="Eliminar"
                        color="danger"
                        onPress={() => handleModalOpen(item)} // abrir modal
                      >
                        Eliminar {theme}
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

// PropTypes
MyTable.propTypes = {
  theme: PropTypes.string,
  endpoint: PropTypes.string,
  data: PropTypes.array,
}
