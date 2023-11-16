import imgCalles from "../assets/imgs/img-calle.jpg"
import imgUsuarios from "../assets/imgs/img-users2.jpg"
import imgBarrios from "../assets/imgs/img-barrio2.jpg"
import imgAreas from "../assets/imgs/img-areas.jpg"
import imgAgregar from "../assets/imgs/add-claim2.jpg"
import imgReclamos from "../assets/imgs/add-claim4.jpg"
import imgTipoReclamos from "../assets/imgs/img-areas2.jpg"

export const sections = [
  {
    title: "Ver reclamos",
    img: imgReclamos,
    to: "/lista-de-reclamos",
    rol: "EMPLEADO",
  },
  {
    title: "Mis reclamos",
    img: imgAgregar,
    to: "/reclamos",
    rol: "CONTRIBUYENTE",
  },
  { title: "Usuarios", img: imgUsuarios, to: "/usuarios", rol: "CAPATAZ" },
  { title: "Calles", img: imgCalles, to: "/calles", rol: "CAPATAZ" },
  { title: "Barrios", img: imgBarrios, to: "/barrios", rol: "CAPATAZ" },
  { title: "Áreas", img: imgAreas, to: "/areas", rol: "CAPATAZ" },
  {
    title: "Tipos de reclamos",
    img: imgTipoReclamos,
    to: "/tipos-de-reclamos",
    rol: "CAPATAZ",
  },
]
