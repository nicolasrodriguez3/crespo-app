import { useEffect, useState } from "react"
import { HomeHeader } from "../components/HomeHeader"
import { CircularProgress, Button } from "@nextui-org/react"
import Post from "../components/Post"
import { useAuth } from "../hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { UsersList } from "./UsersList"
import { StreetsList } from "./StreetsList"



export function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()


  if (user?.roles.includes("JEFE")) {
    return (
      <>
        <HomeHeader />
        <div className="flex min-h-screen w-full flex-col items-center bg-gray-50">
          <div className="flex w-full flex-col items-center justify-center gap-4 pt-4">
            <p className="text-center">
              Tu rol es de administrador, por lo que puedes acceder a la sección
              de administración.
            </p>
            <UsersList />
            <StreetsList />
          </div>
        </div>
      </>
    )
  }

  if (user?.roles.includes("CAPATAZ")) {
    return (
      <>
        <HomeHeader />
        <div className="flex min-h-screen w-full flex-col items-center bg-gray-50">
          <div className="flex w-full flex-col items-center justify-center gap-4 pt-4">
            <p className="text-center">
              Tu rol es de capataz, por lo que puedes acceder a la sección de
              administración.
            </p>
            <button
              className="rounded-md bg-gold px-4 py-2 text-white"
              onClick={() => navigate("/admin")}
            >
              Ir a la sección de administración
            </button>
          </div>
        </div>
      </>
    )
  }

  if (user?.roles.includes("EMPLEADO")) {
    return (
      <>
        <HomeHeader />
        <div className="flex min-h-screen w-full flex-col items-center bg-gray-50">
          <div className="flex w-full flex-col items-center justify-center gap-4 pt-4">
            <p className="text-center">
              Tu rol es de empleado, por lo que puedes acceder a la sección de
              administración.
            </p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <HomeHeader />
      <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col gap-4 pb-16 pt-4">
        <div className="flex flex-col gap-4">
          <Button
            as={Link}
            to="/add"
            className="rounded-md bg-gold font-bold"
          >
            Agregar reclamo
          </Button>
          <Button
            as={Link}
            to="/"
            variant="bordered"
            className="rounded-md border-gold"
          >
            Ver mis reclamos
          </Button>
        </div>
        
      </div>
    </>
  )
}
