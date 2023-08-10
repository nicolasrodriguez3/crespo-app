import homeIcon from "../assets/house.svg"
import addIcon from "../assets/add-square-linear.svg"
import userIcon from "../assets/user-linear.svg"
import homeIconActive from "../assets/house-bold.svg"
import addIconActive from "../assets/add-square-linear.svg"
import userIconActive from "../assets/user-linear.svg"
import NavbarIcons from "./NavbarIcons"

const sections = [
	{
	name: "Inicio",
	icon: homeIcon,
	iconActive: homeIconActive,
	href: "/"
},
	{
	name: "Nuevo",
	icon: addIcon,
	iconActive: addIconActive,
	href: "/add"
},
	{
	name: "Perfil",
	icon: userIcon,
	iconActive: userIconActive,
	href: "/profile"
},
]

function Navbar() {
	return (
		<nav className="fixed bottom-0 left-0 w-full bg-gold">
			<ul className="flex justify-evenly">
				{sections.map((section)=>{
					return (
						<li key={section.name}>
							<NavbarIcons icon={section.icon} iconActive={section.iconActive} href={section.href}/>
						</li>
					)
				})}
			</ul>
		</nav>
	)
}
export default Navbar
