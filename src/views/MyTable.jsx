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
  Chip,
  User,
  Pagination,
} from "@nextui-org/react"

import { SearchIcon } from "../assets/icons/SearchIcon"
import { PlusIcon } from "../assets/icons/PlusIcon"
import { VerticalDotsIcon } from "../assets/icons/VerticalDotsIcon"
import { ChevronDownIcon } from "../assets/icons/ChevronDownIcon"

import { useAuth } from "../hooks/useAuth"
import { useEffect, useState, useMemo } from "react"
import { useCallback } from "react"

export function MyTable() {
  const { user } = useAuth()
  const [filterValue, setFilterValue] = useState("");
  const [data, setData] = useState([])
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(2)
  const [limit, setLimit] = useState(2)
  const [loading, setLoading] = useState(false)

  const hasSearchFilter = Boolean(filterValue);
  const filteredItems = useMemo(() => {
    let filteredData = [...data];

    if (hasSearchFilter) {
      filteredData = filteredData.filter((data) =>
        data.name.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    
    return filteredData;
  }, [data, filterValue, hasSearchFilter ]);

  
  const pages = Math.ceil(filteredItems.length / limit);

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setData([
        {
          id: 1,
          name: "Juan",
          lastName: "Perez",
          phone: "12345",
        },
        {
          id: 2,
          name: "Anto",
          lastName: "dsasda",
          phone: "12345",
        },
        {
          id: 3,
          name: "Nico",
          lastName: "asdasdasd",
          phone: "12345",
        },
      ])
      setLoading(false)
    }, 1000)
  }, [page, limit])

  const items = useMemo(() => {
    const start = (page - 1) * limit
    const end = start + limit

    return filteredItems.slice(start, end)
  }, [page, data, limit, filteredItems])

  const handleSearch = (e) => {
    setSearch(e.target.value)
  }

  const onSearchChange = useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(()=>{
    setFilterValue("")
    setPage(1)
  },[])

  const handleLimitChange = (limit) => {
    setLimit(limit)
  }

  return (
    <>
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
          loading={loading}
          emptyText="No hay datos"
          data={data}
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
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
            <TableColumn>Apellido</TableColumn>
            <TableColumn>Teléfono</TableColumn>
            <TableColumn align="center">Acciones</TableColumn>
          </TableHeader>
          <TableBody emptyContent={"No se encontraron resultados"}>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.lastName}</TableCell>
                <TableCell>{item.phone}</TableCell>
                <TableCell>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        auto
                        iconRight={<ChevronDownIcon />}
                        size="small"
                        variant="text"
                      >
                        <VerticalDotsIcon />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label="Acciones"
                      >
                      <DropdownItem color="error">Eliminar</DropdownItem>
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
