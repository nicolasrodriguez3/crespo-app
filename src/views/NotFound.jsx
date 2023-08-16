import { useRouteError } from "react-router-dom"
import chicken from "../assets/roast-chicken.svg"

export function NotFound() {
	const { status, statusText } = useRouteError()

	return (
		<main className="w-full min-h-screen bg-gradient-to-b from-[#FFD73A] from-10% to-50% flex flex-col items-center gap-4">
			<div className="flex justify-center items-end grow">
				<img
					src={chicken}
					alt="Ícono de un pollo cocido"
					width={100}
				/>
			</div>
			<section className="flex flex-col text-center p-4 pb-28 text-xl">
				<p>Error {status}</p>
				<p className="italic">{statusText}</p>
			</section>
		</main>
	)
}
