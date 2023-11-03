import { Post } from "../components/Post"
import {
  CircularProgress,
  Select,
  SelectItem,
  Input,
  Button,
} from "@nextui-org/react"
import { useAuth } from "../hooks/useAuth"
import { WrapperUI } from "../components/WrapperUI"
import { SortAscIcon } from "../assets/icons/SortAscIcon"
import { SortDescIcon } from "../assets/icons/SortDescIcon"
import { useClaimContext } from "../hooks/useClaimsContext"
import { useEffect } from "react"

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
        <p className="py-4 text-center">No hay reclamos</p>
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
              defaultSelectedKeys={[""]}
              onChange={(e) => {
                handleFilter(e.target.value)
              }}
            >
              <SelectItem
                key=""
                value=""
              >
                Todos
              </SelectItem>
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
          <p className="text-center">No hay reclamos</p>
        )}
        {sortedItems.map((post) => (
          <Post
            post={post}
            key={post.id}
          />
        ))}
      </section>
    </WrapperUI>
  )
}
