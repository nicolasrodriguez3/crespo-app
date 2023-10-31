import { Link } from "react-router-dom"
import logo from "../assets/imgs/logo-full.png"
import Wave from "../assets/imgs/Wave"
import { GoBackIcon } from "../assets/icons/GoBackIcon"

export function HomeHeader({ title }) {
  return (
    <header className="relative w-full">
      <div className="relative z-10 flex h-6 items-center justify-center gap-2 bg-gold px-4 pt-10">
        {title ? (
          <div className="flex w-full max-w-sm items-center gap-3 pt-4">
            <Link to="/">
              <GoBackIcon />
            </Link>
            <h2 className="w-full max-w-sm text-xl font-bold  text-gray-900">
              {title}
            </h2>
          </div>
        ) : (
          <img
            src={logo}
            alt="Logo de la ciudad"
            className="absolute block w-[180px]"
          />
        )}
      </div>
      <div className="relative -top-2 z-0 overflow-hidden">
        <Wave
          height="80px"
          className="relative right-0 scale-x-150"
          draggable={false}
        />
      </div>
    </header>
  )
}
