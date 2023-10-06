import axios from "axios"

function validateResponse(error) {
  if (error.response) {
    // Si la respuesta contiene un estado HTTP no exitoso (por ejemplo, 404 o 500)
    console.error(
      "Error en la respuesta: ",
      error.response.status,
      error.response.statusText,
    )
  } else if (error.request) {
    // Si la solicitud no pudo ser realizada (por ejemplo, el servidor no respondió)
    console.error("Error en la solicitud: ", error.request)
  } else {
    // Otros errores
    console.error("Error: ", error.message)
  }
}

// obtener todos los reclamos
export const getClaims = async (token) => {
  try {
    const response = await axios.get(
      "https://vps-3450851-x.dattaweb.com:9088/api/reclamo/buscar-todos",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return response
  } catch (error) {
    validateResponse(error)
  }
}

// obtener todos los reclamos por usuario
export const getClaimsByUser = async (token) => {
  try {
    const response = await axios.get(
      "https://vps-3450851-x.dattaweb.com:9088/api/reclamo/buscar-por-usuario",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return response
  } catch (error) {
    validateResponse(error)
  }
}

// obtener todos los reclamos por estado
export const getClaimsByStatus = async (token) => {
  try {
    const response = await axios.get(
      "https://vps-3450851-x.dattaweb.com:9088/api/reclamo/buscar-por-estado",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return response
  } catch (error) {
    validateResponse(error)
  }
}

// obtener todos MIS reclamos
export const getMyClaims = async (token) => {
  try {
    const response = await axios.get(
      "https://vps-3450851-x.dattaweb.com:9088/api/reclamo/buscar-por-usuario",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return response
  } catch (error) {
    validateResponse(error)
  }
}

// obtener categorías
export const getCategories = async (token) => {
  const response = await axios(
    "https://vps-3450851-x.dattaweb.com:9088/api/tipo-reclamo/buscar-todas",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
  return response
}

// obtener las calles
export const getStreets = async (token) => {
  try {
    const response = await axios.get(
      "https://vps-3450851-x.dattaweb.com:9088/api/calle/buscar-todas",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return response
  } catch (error) {
    validateResponse(error)
  }
}

// obtener los barrios
export const getNeighborhoods = async (token) => {
  try {
    const response = await axios.get(
      "https://vps-3450851-x.dattaweb.com:9088/api/barrio/buscar-todas",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return response
  } catch (error) {
    validateResponse(error)
  }
}
