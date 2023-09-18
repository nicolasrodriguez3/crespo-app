import { useRouteError } from "react-router-dom"
import chicken from "../assets/icons/roast-chicken.svg"

export function NotFound() {
  const { status, statusText } = useRouteError()

  return (
    <main className="flex min-h-screen w-full flex-col items-center gap-4 bg-gradient-to-b from-[#FFD73A] from-10% to-50%">
      <div className="flex grow items-end justify-center">
        <img
          src={chicken}
          alt="Ícono de un pollo cocido"
          width={100}
        />
      </div>
      <section className="flex flex-col p-4 pb-28 text-center text-xl">
        <p>Error {status}</p>
        <p className="italic">{statusText}</p>
      </section>
    </main>
  )
}
