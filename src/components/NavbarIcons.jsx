import { NavLink } from "react-router-dom"

function NavbarIcons({ name, icon, iconActive, href }) {
  return (
    <NavLink
      to={href}
      className="rounded p-2 flex flex-col items-center justify-center text-black hover:text-gray-800 w-16 overflow-hidden text-ellipsis"
      title={name}
    >
      {({ isActive }) => (
        <>
          <img
            src={isActive ? iconActive : icon}
            width={24}
          />
          <p className={isActive ? "text-xs font-bold" : "text-xs"}>{name}</p>
        </>
      )}
    </NavLink>
  )
}
export default NavbarIcons
