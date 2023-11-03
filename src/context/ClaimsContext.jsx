import { createContext, useState, useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import { useMemo } from "react"
import { getClaims, getMyClaims } from "../helpers/api"

export const ClaimsContext = createContext()

const ClaimsContextProvider = ({ children }) => {
  const { token } = useAuth()
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [getAllClaims, setGetAllClaims] = useState(false)

  // filtrar reclamos
  const [searchClaimBy, setSearchClaimBy] = useState("descripcion")
  const [filterClaimBy, setFilterClaimBy] = useState(false)

  const [filteredClaims, setFilteredClaims] = useState("")
  const isSearchFilter = Boolean(filteredClaims)
  const [isSorted, setIsSorted] = useState(true)

  const filteredItems = useMemo(() => {
    let filteredData = [...claims]

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
  }, [claims, filteredClaims, isSearchFilter, searchClaimBy, filterClaimBy])

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

  // obtener los posts
  const fetchData = async (getAllClaims) => {
    const fetchClaims = getAllClaims ? getClaims : getMyClaims
    try {
      const response = await fetchClaims(token)
      if (response.status === 200) {
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
        setClaims(mappedPosts.reverse())
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

  const handleSort = () => {
    setIsSorted(!isSorted)
  }

  // filtrar reclamos según estado
  const handleFilter = (filter) => {
    setFilterClaimBy(filter)
  }

  // elegir por que campo buscar
  const handleSearchBy = (search) => {
    setSearchClaimBy(search)
    setFilteredClaims("")
  }

  // buscar reclamos
  const handleSearch = (search) => {
    setFilteredClaims(search)
  }

  const contextValue = {
    claims,
    loading,
    error,
    handleSort,
    isSorted,
    sortedItems,
    handleFilter,
    handleSearchBy,
    handleSearch,
    filteredClaims,
    setGetAllClaims,
    fetchData,
  }

  return (
    <ClaimsContext.Provider value={contextValue}>
      {children}
    </ClaimsContext.Provider>
  )
}

export default ClaimsContextProvider
