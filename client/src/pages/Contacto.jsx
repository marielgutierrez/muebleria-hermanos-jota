import Hero from "../components/Hero";
// TODO: la lógica del formulario (useState, handleChange, handleSubmit, limpiar)
// es parte de otro integrante. Acá solo queda el markup y las clases CSS.

const LIMITE_CARACTERES = 600;

const datosContacto = [
  {
    titulo: "Showroom y taller",
    lineas: [
      "Av. San Juan 2847, C1232AAB",
      "Barrio de San Cristóbal, Ciudad Autónoma de Buenos Aires",
      "Lun a Vie: 10:00 - 19:00 · Sáb: 10:00 - 14:00",
    ],
  },
  {
    titulo: "Consultas directas",
    lineas: [
      "info@hermanosjota.com.ar",
      "ventas@hermanosjota.com.ar",
      "+54 11 4567-8900",
    ],
  },
  {
    titulo: "Encargos a medida",
    lineas: [
      "Trabamos piezas únicas en nogal, algarrobo y guatambú certificados. El plazo estimado de fabricación es de 6 a 10 semanas según complejidad.",
    ],
  },
];

function Contacto() {
  return (
    <>
    <Hero
  titulo={<>Hablemos de tu próxima pieza</>}
  subtitulo="Ya sea un encargo a medida, una visita al taller o una duda sobre materiales, del otro lado hay personas que trabajan la madera todos los días. Escribinos y te respondemos con nombre y apellid."
  compacto
/>  
    <section className="contacto">
      <div className="container">
        <h2 className="section-title">Contacto</h2>
        <p className="section-subtitle">
          Escribinos y te respondemos dentro de las próximas 48 horas hábiles.
        </p>

        <div className="contacto__layout">
          <div className="contacto__form-col">
            <form className="contacto__card" noValidate>
              <div className="contacto__field">
                <label className="contacto__label" htmlFor="contacto-nombre">
                  Nombre y apellido <span className="contacto__required">*</span>
                </label>
                <input
                  id="contacto-nombre"
                  className="contacto__input"
                  type="text"
                  name="nombre"
                  placeholder="Camila Bianchi"
                  autoComplete="name"
                  required
                />
              </div>

              <div className="contacto__field">
                <label className="contacto__label" htmlFor="contacto-email">
                  Email <span className="contacto__required">*</span>
                </label>
                <input
                  id="contacto-email"
                  className="contacto__input"
                  type="email"
                  name="email"
                  placeholder="nombre@correo.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="contacto__field">
                <label className="contacto__label" htmlFor="contacto-mensaje">
                  Mensaje <span className="contacto__required">*</span>
                </label>
                <textarea
                  id="contacto-mensaje"
                  className="contacto__textarea"
                  name="mensaje"
                  rows={7}
                  maxLength={LIMITE_CARACTERES}
                  placeholder="Contanos qué pieza tenés en mente: medidas, maderas o plazos."
                  required
                />
                <p className="contacto__counter" aria-live="polite">
                  0 / {LIMITE_CARACTERES} caracteres
                </p>
              </div>

              <div className="contacto__form-footer">
                <p className="contacto__note">
                  Los campos marcados con <span className="contacto__required">*</span> son obligatorios.
                </p>

                <div className="contacto__actions">
                  <button type="submit" className="btn btn--primary">
                    Enviar mensaje
                  </button>
                  <button type="button" className="btn btn--secondary">
                    Limpiar
                  </button>
                </div>
              </div>
            </form>
          </div>

          <aside className="contacto__info-col">
            <h3 className="contacto__info-title">Otras formas de encontrarnos</h3>

            <div className="contacto__info-list">
              {datosContacto.map((item) => (
                <article key={item.titulo} className="contacto__info-card">
                  <h4 className="contacto__info-card-title">{item.titulo}</h4>
                  {item.lineas.map((linea) => (
                    <p key={linea} className="contacto__info-text">
                      {linea}
                    </p>
                  ))}
                </article>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
    </>
  );
}

export default Contacto;
