import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { CircularProgress } from "@nextui-org/react"
import PropTypes from "prop-types"

export function ProtectedRoute({ children }) {
  const { token, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex w-full justify-center">
        <CircularProgress
          size="sm"
          aria-label="Cargando..."
        />
      </div>
    )
  }

  if (!token) return <Navigate to="/login" />
  return <>{children}</>
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
}
