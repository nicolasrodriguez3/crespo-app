import axios from "axios"

export async function getUserData(token) {
  try {
    const response = await axios.get(
      "https://vps-3450851-x.dattaweb.com:9088/api/usuario/mis-datos",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return response.data
  } catch ({ response }) {
    console.log(response)
    return response
  }
}
