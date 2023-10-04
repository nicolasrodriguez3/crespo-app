import PropTypes from "prop-types"

function Post({ data }) {
  const {
    altura,
    barrio,
    calle,
    descripcion,
    id,
    imagen,
    seguimiento,
    tipoReclamo,
  } = data

  return (
    <article>
      {/* <img src={media[0].src} /> */}
      <section className="flex flex-col items-start gap-2 p-2">
        <h3 className="text-xl">{tipoReclamo.tipo}</h3>
        <p className="">{descripcion}</p>
      </section>
    </article>
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
      fecha: PropTypes.string,
      id: PropTypes.string,
      estado: PropTypes.string,
    }),
    tipoReclamo: PropTypes.shape({
      id: PropTypes.string,
      tipo: PropTypes.string,
    }),
  }),
}

export default Post
