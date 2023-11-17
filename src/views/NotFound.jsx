import { useRouteError } from "react-router-dom"
import chicken from "../assets/imgs/sad-chicken.png"

export function NotFound() {
  const { status, statusText } = useRouteError()

  return (
    <main className="flex min-h-screen w-full flex-col items-center gap-2 bg-gradient-to-b from-[#FFD73A] from-10% to-50%">
      <div className="flex grow items-end justify-center">
        <img
          src={chicken}
          alt="Ícono de una gallina triste"
          width={120}
        />
      </div>
      <section className="flex flex-col p-3 pb-40 text-center text-xl">
        <p>Ocurrió un error {status}</p>
        <p className="italic">{statusText}</p>
        <p className="text-base">
          Intente recargar la página o{" "}
          <a
            href="/"
            className="underline underline-offset-2 "
          >
            ir a la página de inicio
          </a>
        </p>
      </section>
    </main>
  )
}
