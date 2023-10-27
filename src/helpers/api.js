import axios from "axios"
const API_URL = import.meta.env.VITE_API_URL

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

// obtener mis reclamos
export async function getMyClaims(token) {
  try {
    const response = await axios.get(
      "https://vps-3450851-x.dattaweb.com:9088/api/reclamo/buscar-todos-mis-reclamos",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    return response
  } catch (error) {
    validateResponse(error)
  }
}

// obtener todos los reclamos
export async function getClaims(token) {
  try {
    const response = await axios.get(
      "https://vps-3450851-x.dattaweb.com:9088/api/reclamo/buscar-todos",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return response
  } catch (error) {
    validateResponse(error)
  }
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
      }
    )
    return response
  } catch (error) {
    validateResponse(error)
  }
}

// obtener todos los reclamos por estado
export async function getClaimsByStatus(token) {
  try {
    const response = await axios.get(
      "https://vps-3450851-x.dattaweb.com:9088/api/reclamo/buscar-por-estado",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return response
  } catch (error) {
    validateResponse(error)
  }
}

// obtener categorías
export async function getCategories(token) {
  const response = await axios(
    "https://vps-3450851-x.dattaweb.com:9088/api/tipo-reclamo/buscar-todas",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  return response
}

// obtener las calles
export async function getStreets(token) {
  try {
    const response = await axios.get(
      "https://vps-3450851-x.dattaweb.com:9088/api/calle/buscar-todas",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return response
  } catch (error) {
    validateResponse(error)
  }
}

// obtener los barrios
export async function getNeighborhoods(token) {
  try {
    const response = await axios.get(
      "https://vps-3450851-x.dattaweb.com:9088/api/barrio/buscar-todas",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return response
  } catch (error) {
    validateResponse(error)
  }
}

export async function uploadImage(imagen, token) {
  const formData = new FormData();
  formData.append("file", imagen);
  const responseFile = await axios.put(`${API_URL}/archivo/guardar`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  if (responseFile.status !== 200) {
    throw new Error("Error al subir la imagen.");
  }

  return responseFile.data.id;
}

export async function submitClaim(claimData, token) {
  const response = await axios.put(`${API_URL}/reclamo`, claimData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status !== 200) {
    throw new Error("Error al presentar el reclamo.");
  }

  return response;
}