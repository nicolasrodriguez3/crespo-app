import { HomeHeader } from "./HomeHeader"
import { useAuth } from "../hooks/useAuth"

export function WrapperUI({ children, title }) {
  const { user } = useAuth()
  const name = user?.nombre.split(" ")[0] || "usuario"

  return (
    <>
      <HomeHeader title={title} />
      <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col gap-4 px-2 pb-16 pt-4">
        {children}
      </div>
    </>
  )
}
