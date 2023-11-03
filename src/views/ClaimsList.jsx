import { useState, useEffect } from "react"
import { Post } from "../components/Post"
import {
  CircularProgress,
  Select,
  SelectItem,
  Input,
  Button,
} from "@nextui-org/react"
import { useAuth } from "../hooks/useAuth"
import { getClaims, getMyClaims } from "../helpers/api"
import { WrapperUI } from "../components/WrapperUI"
import { useMemo } from "react"
import { SortAscIcon } from "../assets/icons/SortAscIcon"
import { SortDescIcon } from "../assets/icons/SortDescIcon"

export function ClaimsList({ getAllPosts }) {
  const { token, user } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // filtrar reclamos
  const [searchClaimBy, setSearchClaimBy] = useState("descripcion")
  const [filterClaimBy, setFilterClaimBy] = useState(false)

  const [filteredClaims, setFilteredClaims] = useState("")
  const isSearchFilter = Boolean(filteredClaims)
  const [isSorted, setIsSorted] = useState(true)

  const filteredItems = useMemo(() => {
    let filteredData = [...posts]

    if (filterClaimBy) {
      filteredData = filteredData.filter((post) => {
        return post.seguimiento[0].estado === filterClaimBy
      })
    }

    if (isSearchFilter) {
      filteredData = filteredData.filter((post) => {
        return post[searchClaimBy]
          ?.toLowerCase()
          .includes(filteredClaims.toLowerCase())
      })
    }

    return filteredData
  }, [posts, filteredClaims, isSearchFilter, searchClaimBy, filterClaimBy])

  // ordenar reclamos
  const sortedItems = useMemo(() => {
    let sortedData = [...filteredItems]

    if (isSorted) {
      sortedData = sortedData.sort((a, b) => {
        return a.creado < b.creado ? 1 : -1
      })
    } else {
      sortedData = sortedData.sort((a, b) => {
        return a.creado > b.creado ? 1 : -1
      })
    }

    return sortedData
  }, [filteredItems, isSorted])

  useEffect(() => {
    setError(null)
    setLoading(true)

    const fetchClaims = getAllPosts ? getClaims : getMyClaims

    // obtener los posts
    const fetchData = async () => {
      try {
        const response = await fetchClaims(token)
        if (response.status === 200) {
          console.log(response.data)
          const mappedPosts = response.data.map((post) => ({
            id: post.id,
            descripcion: post.descripcion,
            direccion: `${post.calle.calle} ${post.altura}`,
            tipoReclamo: post.tipoReclamo.tipo,
            nombrePersona: post.persona.nombre,
            imagen: post.imagen,
            seguimiento: post.seguimiento.estados,
            creado: post.creada,
          }))
          setPosts(mappedPosts.reverse())
        } else {
          throw new Error("Error obteniendo los posts")
        }
      } catch (error) {
        console.warn("Error:", error)
        setError(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token, getAllPosts])

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

  if (posts.length === 0) {
    return (
      <WrapperUI>
        <p className="py-4 text-center">No hay reclamos</p>
      </WrapperUI>
    )
  }

  return (
    <WrapperUI title={getAllPosts ? "Todos los reclamos" : "Mis reclamos"}>
      {user.roles.includes("EMPLEADO") && (
        <>
          <section>
            <div className="mb-2">Filtros</div>
            <div className="flex gap-2 ">
              <Select
                label="Buscar por..."
                defaultSelectedKeys={["descripcion"]}
                onChange={(e) => {
                  setSearchClaimBy(e.target.value)
                  setFilteredClaims("")
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
                  setFilteredClaims(e.target.value)
                }}
                value={filteredClaims}
              />
            </div>
          </section>
          <section>
            <div className="flex gap-2">
              {/* // todo: agregar filtro por estado */}
              <Select
                label="Estado de reclamo"
                defaultSelectedKeys={[""]}
                onChange={(e) => {
                  setFilterClaimBy(e.target.value)
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
                onClick={() => setIsSorted(!isSorted)}
              >
                {!isSorted ? <SortAscIcon /> : <SortDescIcon />}
              </Button>
            </div>
          </section>
        </>
      )}
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
