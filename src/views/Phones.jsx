import { WrapperUI } from "../components/WrapperUI"
import { datosUtiles } from "../constants/datosUtiles"

function Phones() {
  return (
    <WrapperUI title="Teléfonos utiles">
      {datosUtiles.map(({ title, telefonos }) => {
        return (
          <div key={title}>
            <h2 className="my-2 bg-gold p-2 font-semibold">{title}</h2>
            {telefonos.map(({ telefono, nombre, interno }) => {
              return (
                <div
                  key={nombre}
                  className="flex items-center justify-between gap-2 rounded p-2 even:bg-gray-100 "
                >
                  <span>{nombre} </span>
                  <div className="text-right">
                    <div className="flex flex-wrap justify-end gap-1 font-semibold">
                      {typeof telefono === "string" ? (
                        <a href={`tel:${telefono}`}>{telefono}</a>
                      ) : (
                        telefono.map((tel, i) => (
                          <>
                            <a
                              href={`tel:${tel}`}
                              key={i}
                            >
                              {tel}
                            </a>
                            <span className="last:hidden">-</span>
                          </>
                        ))
                      )}
                    </div>
                    {interno && <span>Int. {interno}</span>}
                  </div>
                </div>
              )
            })}
          </div>
        )
      })}
    </WrapperUI>
  )
}
export default Phones
