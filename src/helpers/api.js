import axios from "axios"
const API_URL = import.meta.env.VITE_API_URL

// obtener mis reclamos
export async function getMyClaims(token) {
  return axios.get(
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
  return axios.get(
    "https://vps-3450851-x.dattaweb.com:9088/api/reclamo/buscar-todas",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
}

export async function getClaimsWithDeleted(token) {
  return axios.get(
    "https://vps-3450851-x.dattaweb.com:9088/api/reclamo/buscar-todas-con-eliminadas",
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
  return await axios.put(`${API_URL}/reclamo`, claimData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const uploadImageAndSubmitClaim = async ({ imagen, token, data }) => {
  let imagenId = null
  if (imagen) {
    imagenId = await uploadImage(imagen, token)
  }

  const claimDataWithFile = {
    ...data,
    imagen_id: imagenId,
  }
  const response = await submitClaim(claimDataWithFile, token)
  return response
}
