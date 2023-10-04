import axios from "axios"

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
    if (error.response) {
      // Si la respuesta contiene un estado HTTP no exitoso (por ejemplo, 404 o 500)
      console.error(
        "Error en la respuesta:",
        error.response.status,
        error.response.statusText,
      )
    } else if (error.request) {
      // Si la solicitud no pudo ser realizada (por ejemplo, el servidor no respondió)
      console.error("Error en la solicitud:", error.request)
    } else {
      // Otros errores
      console.error("Error:", error.message)
    }
  }
}

export const getnNeighborhoods = async (token) => {
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
}
