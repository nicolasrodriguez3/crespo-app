import { Post } from "../components/Post"
import {
  CircularProgress,
  Select,
  SelectItem,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react"
import { useAuth } from "../hooks/useAuth"
import { WrapperUI } from "../components/WrapperUI"
import { SortAscIcon } from "../assets/icons/SortAscIcon"
import { SortDescIcon } from "../assets/icons/SortDescIcon"
import { useClaimContext } from "../hooks/useClaimsContext"
import { useEffect } from "react"
import { useState } from "react"

export function ClaimsList({ getAllClaims }) {
  const { user } = useAuth()
  const {
    claims,
    loading,
    error,
    handleSearchBy,
    handleSearch,
    handleFilter,
    filteredClaims,
    handleSort,
    isSorted,
    sortedItems,
    fetchData,
  } = useClaimContext()

  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [id, setId] = useState(null)

  const { descripcion, seguimiento, direccion, tipoReclamo } =
    claims.find((claim) => claim.id === id) || {}

  const handleOpen = (id) => {
    setId(id)
    if (!isOpen) onOpen()
  }

  useEffect(() => {
    fetchData(getAllClaims)
  }, [getAllClaims])

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

  if (error) {
    return (
      <WrapperUI>
        <div className="flex min-h-screen w-full flex-col items-center bg-gray-50">
          <div className="flex w-full flex-col items-center justify-center gap-4 pt-4">
            <p className="text-center">
              Ha ocurrido un error obteniendo los posts.
            </p>
          </div>
        </div>
      </WrapperUI>
    )
  }

  if (claims.length === 0) {
    return (
      <WrapperUI>
        <p className="py-4 text-center">No tienes reclamos realizados.</p>
      </WrapperUI>
    )
  }

  return (
    <WrapperUI title={getAllClaims ? "Lista de reclamos" : "Mis reclamos"}>
      <>
        {user.roles.includes("EMPLEADO") && (
          <section>
            <div className="mb-2">Filtros</div>
            <div className="flex gap-2 ">
              <Select
                label="Buscar por..."
                defaultSelectedKeys={["descripcion"]}
                onChange={(e) => {
                  handleSearchBy(e.target.value)
                }}
              >
                <SelectItem
                  key="descripcion"
                  value="descripcion"
                >
                  Descripción
                </SelectItem>
                <SelectItem
                  key="direccion"
                  value="direccion"
                >
                  Dirección
                </SelectItem>
                <SelectItem
                  key="tipoReclamo"
                  value="tipoReclamo"
                >
                  Tipo de reclamo
                </SelectItem>
                <SelectItem
                  key="nombrePersona"
                  value="nombrePersona"
                >
                  Persona
                </SelectItem>
              </Select>
              <Input
                type="text"
                placeholder="Buscar reclamo"
                classNames={{ mainWrapper: "flex-row", inputWrapper: "h-auto" }}
                onChange={(e) => {
                  handleSearch(e.target.value)
                }}
                value={filteredClaims}
              />
            </div>
          </section>
        )}

        <section>
          <div className="flex gap-2">
            <Select
              label="Estado de reclamo"
              defaultSelectedKeys={["INICIADO", "EN_CURSO"]}
              selectionMode="multiple"
              onChange={(e) => {
                handleFilter(e.target.value)
              }}
            >
              <SelectItem
                key="INICIADO"
                value="INICIADO"
              >
                Iniciado
              </SelectItem>
              <SelectItem
                key="EN_CURSO"
                value="EN_CURSO"
              >
                En curso
              </SelectItem>
              <SelectItem
                key="RESUELTO"
                value="RESUELTO"
              >
                Resuelto
              </SelectItem>
              <SelectItem
                key="RECHAZADO"
                value="RECHAZADO"
              >
                Rechazado
              </SelectItem>
            </Select>

            <Button
              className="h-auto w-16"
              isIconOnly
              variant="flat"
              title="Ordenar por fecha"
              onClick={handleSort}
            >
              {!isSorted ? <SortAscIcon /> : <SortDescIcon />}
            </Button>
          </div>
        </section>
      </>

      <section className="flex flex-col gap-4">
        {sortedItems.length === 0 && (
          <p className="text-center">No hay reclamos.</p>
        )}
        {sortedItems.map((post) => (
          <Post
            post={post}
            key={post.id}
            handleOpen={handleOpen}
          />
        ))}
      </section>
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
                  <p className="mb-2 font-bold">Seguimiento</p>
                  <ol className="relative flex flex-col gap-4 border-l border-gray-200 pb-2">
                    {seguimiento.map((estado) => (
                      <li
                        key={estado.id}
                        className="ml-4"
                      >
                        <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-200"></div>

                        <h4 className="text-sm font-semibold leading-none text-gray-900">
                          {estado.estado.replace("_", " ")}
                        </h4>
                        <time
                          title="Fecha de creación"
                          className="text-xs font-normal leading-none text-gray-400"
                        >
                          {estado.creada
                            ? new Date(estado.creada).toLocaleString()
                            : ""}
                        </time>
                        <p className="text-xs font-normal text-gray-600">
                          {estado.descripcion}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>
                <p>Tipo de reclamo: {tipoReclamo}</p>
                <p>Dirección: {direccion}</p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onPress={onClose}
                >
                  Cerrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </WrapperUI>
  )
}
