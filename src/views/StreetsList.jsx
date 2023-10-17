import axios from "axios"
import { useState, useEffect } from "react"
import { useAuth } from "../hooks/useAuth"

const API_URL = import.meta.env.VITE_API_URL

export function StreetsList() {
  const { token } = useAuth()
  const [streets, setStreets] = useState([])

  useEffect(() => {
    axios
      .get(`${API_URL}/calle/buscar-todas`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setStreets(res.data)
				console.log(res)
      })
  }, [token])

  return (
    <div>
      <h2 className="font-bold">Streets List</h2>
      <ul>
        {streets.map((street) => (
          <li key={street.id}>{street.calle}</li>
        ))}
      </ul>
    </div>
  )
}
