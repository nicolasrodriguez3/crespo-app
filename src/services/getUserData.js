import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

export async function getUserData(token) {
    const response = await axios.get(`${API_URL}/usuario/mis-datos`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
}
