import PropTypes from "prop-types"
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"

function Post({ data }) {
  const { id, imagen, seguimiento, descripcion, tipoReclamo } = data
  console.log(data)
  const navigate = useNavigate()

  return (
    <Card
      className="w-full py-4"
      isPressable
      as={Link}
      to={`/reclamos/${id}`}
    >
      <CardHeader className="flex-col items-start px-4 pb-0 pt-2">
        <p className="text-tiny font-bold">Reclamo nro. {id}</p>
        <small className="text-default-500">
          Estado: {seguimiento.estados[0].estado}
        </small>
        <h4 className="text-large font-bold">{tipoReclamo.tipo}</h4>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        {imagen ? (
          <Image
            alt="Card background"
            className="rounded-xl object-cover"
            src="/images/hero-card-complete.jpeg"
            width="100%"
          />
        ) : (
          <p className="text-default-500">{descripcion}</p>
        )}
      </CardBody>
    </Card>
  )
}

Post.propTypes = {
  data: PropTypes.shape({
    altura: PropTypes.string,
    barrio: PropTypes.shape({
      barrio: PropTypes.string,
      id: PropTypes.string,
    }),
    calle: PropTypes.shape({
      calle: PropTypes.string,
      id: PropTypes.string,
    }),
    descripcion: PropTypes.string,
    id: PropTypes.string,
    imagen: PropTypes.string,
    seguimiento: PropTypes.shape({
      estados: PropTypes.arrayOf(
        PropTypes.shape({
          estado: PropTypes.string,
          descripcion: PropTypes.string,
          id: PropTypes.string,
        }),
      ),
    }),
    tipoReclamo: PropTypes.shape({
      id: PropTypes.string,
      tipo: PropTypes.string,
    }),
  }),
}

export default Post
