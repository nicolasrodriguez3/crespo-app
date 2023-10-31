import { useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { Button, Avatar } from "@nextui-org/react"
import { useNavigate, Link } from "react-router-dom"
import { Navbar } from "../components/Navbar"
import logoutIcon from "../assets/icons/logout-2-linear.svg"
import penIcon from "../assets/icons/pen-2-linear.svg"
import claimsIcon from "../assets/icons/checklist-minimalistic-linear.svg"
import arrowIcon from "../assets/icons/alt-arrow-right-linear.svg"
import { WrapperUI } from "../components/WrapperUI"

export function Profile() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    try{
      const userLoguot = await logout()
      if(userLoguot){
        setLoading(false)
        navigate("/login")
      }
    }
    catch(error){
      console.error("Error durante el cierre de sesión:", error)
      setLoading(false)
    }
  }

  return (
    <WrapperUI>
      <div className="">
        <header className="mb-4 flex flex-col items-center gap-2">
          <Avatar
            radius="full"
            className="h-24 w-24 rounded-full"
            src={user?.photoURL || "/chicken.svg"}
            name={user?.nombre}
          />
          <p>{user?.nombre || "Usuario" }</p>
        </header>
        <ul className="flex flex-col gap-2 p-4 max-w-xs mx-auto">
          <li>
            <Button
              as={Link}
              to="/profile/edit"
              isLoading={loading}
              variant="light"
              className="w-full"
              startContent={
                <img
                  src={penIcon}
                  alt="Salir"
                  width={24}
                />
              }
              endContent={
                <img
                  src={arrowIcon}
                  alt="Salir"
                  width={24}
                />
              }
            >
              <span className="grow">Editar perfil</span>
            </Button>
          </li>
          <li>
            <Button
              onClick={handleLogout}
              isLoading={loading}
              variant="light"
              startContent={
                <img
                  src={logoutIcon}
                  alt="Salir"
                  width={24}
                />
              }
            >
              Cerrar sesión
            </Button>
          </li>
        </ul>
      </div>
      <Navbar />
    </WrapperUI>
  )
}
