import homeIcon from "../assets/icons/house.svg"
import addIcon from "../assets/icons/add-square-linear.svg"
import userIcon from "../assets/icons/user-linear.svg"
import homeIconActive from "../assets/icons/house-bold.svg"
import addIconActive from "../assets/icons/add-square-bold.svg"
import userIconActive from "../assets/icons/user-bold.svg"
import NavbarIcons from "./NavbarIcons"

const sections = [
  {
    name: "Inicio",
    icon: homeIcon,
    iconActive: homeIconActive,
    href: "/",
  },
  {
    name: "Nuevo",
    icon: addIcon,
    iconActive: addIconActive,
    href: "/nuevo",
  },
  {
    name: "Perfil",
    icon: userIcon,
    iconActive: userIconActive,
    href: "/profile",
  },
]

export function Navbar() {
  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full bg-gold">
      <ul className="mx-auto flex max-w-sm select-none justify-evenly">
        {sections.map((section) => {
          return (
            <li key={section.name}>
              <NavbarIcons
                name={section.name}
                icon={section.icon}
                iconActive={section.iconActive}
                href={section.href}
              />
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
