import axios from "axios"

export const createInstance = async ({ token, newData, url }) => {
  try {
    const response = await axios.put(url, newData, {
      headers: { Authorization: `Bearer ${token}` },
    })

    console.log(response)
    return response.data
  } catch (error) {
    console.error(error)
    throw new Error("Error al agregar el área")
  }
}
