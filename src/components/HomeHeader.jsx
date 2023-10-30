import logo from "../assets/imgs/logo-full.png"
import Wave from "../assets/imgs/Wave"

export function HomeHeader({ title }) {
  return (
    <header className="relative w-full">
      <div className="relative z-10 flex h-6 justify-center bg-gold pt-3">
        {title ? (
          <h2 className="w-full max-w-sm px-2 pt-2 text-xl font-bold  text-gray-900">
            {title}
          </h2>
        ) : (
          <img
            src={logo}
            alt="Logo de la ciudad"
            className="absolute block w-[180px]"
          />
        )}
      </div>
      <div className="relative z-0 overflow-hidden">
        <Wave
          height="80px"
          className="scale-x-150"
          draggable={false}
        />
      </div>
    </header>
  )
}
