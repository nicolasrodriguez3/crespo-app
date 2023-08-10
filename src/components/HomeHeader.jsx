import { useState } from "react"

export function HomeHeader() {
	const [category, setCategory] = useState(1)
	const name = "Nico"

	return (
		<header className="w-full pb-8">
			<h1 className="text-xl p-4">Hola, {name}.</h1>
			<nav className="flex justify-center gap-10 items-center text-xl relative">
				<button className={category === 1 && "font-bold underline"} onClick={() => setCategory(1)}>
					Populares
				</button>
				<span className="h-10 bg-black w-[1px] absolute left-1/2"></span>
				<button className={category === 2 && "font-bold underline"} onClick={() => setCategory(2)}>
					Recientes
				</button>
			</nav>
		</header>
	)
}
