import logo from "../assets/imgs/logo-full.png"
import { useAuth } from "../hooks/useAuth"

export function HomeHeader() {
  const { user } = useAuth()
  console.log(user)
  const name = user?.displayName || user?.name || "Pollito"

  return (
    <header className="w-full text-center">
      <div className="relative flex justify-center bg-gold p-2">
        <h1 className="">
          <img
            src={logo}
            alt="Logo de la ciudad"
            className="block w-[180px]"
          />
        </h1>
      </div>
      <h2 className="bg-gold/80 p-3 text-lg">Bienvenido, {name}.</h2>
    </header>
  )
}
