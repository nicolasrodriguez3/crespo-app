import logo from '../assets/logo-full.png'

export function HomeHeader() {
	const name = "Nico"

	return (
		<header className="w-full text-center">
			<h1 className="bg-gold p-2 flex justify-center">
				<img src={logo} alt='Logo de la ciudad' className='block w-[180px]'/>
			</h1>
			<h2 className="bg-gold/80 text-lg p-3">Buen dia, {name}.</h2>
		</header>
	)
}
