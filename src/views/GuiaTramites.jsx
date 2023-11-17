import { Link } from "@nextui-org/react"
import { guiaDeTramites } from "../constants/guiaDeTramites"
import { WrapperUI } from "../components/WrapperUI"

function GuiaTramites() {
  return (
    <WrapperUI title="Guía de trámites">
      {guiaDeTramites.map(({ title, links }) => {
        return (
          <div key={title}>
            <h2 className="my-2 bg-gold p-2 font-semibold">{title}</h2>
            <ul>
              {links.map(({ title, url }) => {
                return (
                  <li
                    key={title}
                    className="rounded p-2 even:bg-gray-100"
                  >
                    <Link
                      color="foreground"
                      isExternal
                      href={url}
                    >
                      {title}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </WrapperUI>
  )
}
export default GuiaTramites
