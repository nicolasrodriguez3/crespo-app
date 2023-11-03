import { useContext } from "react"
import { ClaimsContext } from "../context/ClaimsContext"

export const useClaimContext = () => {
  const context = useContext(ClaimsContext)
  if (!context) throw new Error("There is not context provider")

  return context
}
