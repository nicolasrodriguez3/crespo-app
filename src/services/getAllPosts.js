import axios from "axios"

export const getAllPosts = async (token) => {
  const response = await axios.get(
    "https://vps-3450851-x.dattaweb.com:9088/api/reclamo/buscar-todos-mis-reclamos",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  return { data: response.data, status: response.status }
}