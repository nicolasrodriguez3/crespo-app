import { NavLink } from "react-router-dom"

function NavbarIcons({ icon, iconActive, href }) {
	return (
		<NavLink
			to={href}
			className="p-2 block rounded">
			{({ isActive }) => (
				<img
					src={isActive ? iconActive : icon}
					width={32}
				/>
			)}
		</NavLink>
	)
}
export default NavbarIcons
