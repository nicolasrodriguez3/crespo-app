import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { CircularProgress } from "@nextui-org/react"

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading)
    return (
      <div className="flex w-full justify-center">
        <CircularProgress
          size="sm"
          aria-label="Cargando..."
        />
      </div>
    )

  //if (!user) return <Navigate to="/login" />
  return <>{children}</>
}
