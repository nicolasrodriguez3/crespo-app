import axios from "axios"
const API_URL = import.meta.env.VITE_API_URL
const API_IMAGES_URL = import.meta.env.VITE_API_IMAGES_URL

function validateResponse(error) {
  if (error.response) {
    // Si la respuesta contiene un estado HTTP no exitoso (por ejemplo, 404 o 500)
    throw new Error(`Error en la respuesta: ${error.response.status}`)
  } else if (error.request) {
    // Si la solicitud no pudo ser realizada (por ejemplo, el servidor no respondió)
    throw new Error(`Error en la solicitud: ${error.request}`)
  } else {
    // Otros errores
    throw new Error(`Error: ${error.message}`)
  }
}

// obtener mis reclamos
export async function getMyClaims(token) {
  return await axios.get(
    "https://vps-3450851-x.dattaweb.com:9088/api/reclamo/buscar-todos-mis-reclamos",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}

// obtener todos los reclamos
export async function getClaims(token) {
  return await axios.get(
    "https://vps-3450851-x.dattaweb.com:9088/api/reclamo/buscar-todas",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}

// obtener todos los reclamos por usuario
export async function getClaimsByUser(token) {
  try {
    const response = await axios.get(
      "https://vps-3450851-x.dattaweb.com:9088/api/reclamo/buscar-por-usuario",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return { data: response.data, status: response.status }
  } catch (error) {
    validateResponse(error)
  }
}

// obtener todos los reclamos por estado
export async function getClaimsByStatus(token) {
  return await axios.get(
    "https://vps-3450851-x.dattaweb.com:9088/api/reclamo/buscar-por-estado",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}

// obtener categorías
export async function getCategories(token) {
  return await axios(
    "https://vps-3450851-x.dattaweb.com:9088/api/tipo-reclamo/buscar-todas",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}

// obtener las calles
export async function getStreets(token) {
  return await axios.get(
    "https://vps-3450851-x.dattaweb.com:9088/api/calle/buscar-todas",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}

// obtener los barrios
export async function getNeighborhoods(token) {
  return await axios.get(
    "https://vps-3450851-x.dattaweb.com:9088/api/barrio/buscar-todas",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}

export async function uploadImage(imagen, token) {
  const formData = new FormData()
  formData.append("file", imagen)
  const responseFile = await axios.put(`${API_URL}/archivo/guardar`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  })

  if (responseFile.status !== 200) {
    throw new Error("Error al subir la imagen.")
  }

  return responseFile.data.id
}

export async function submitClaim(claimData, token) {
  const response = await axios.put(`${API_URL}/reclamo`, claimData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (response.status !== 200) {
    throw new Error("Error al presentar el reclamo.")
  }

  return response
}
