import { useState } from "react";

const formatPrice = (precio) =>
  Number(precio).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });

function ProductDetail({ producto, onAgregar }) {
  const [cantidad, setCantidad] = useState(1);

  const {
  name: nombre,
  category: categoria,
  material,
  price: precio,
  image: imagen,
  description: descripcion,
  highlights: destacados = [],
  manufacturing: fabricacion,
  specs: especificaciones = {},
} = producto;

  const cambiarCantidad = (valor) => {
    const n = parseInt(valor, 10);
    setCantidad(Math.min(10, Math.max(1, n || 1)));
  };

  return (
    <section className="product-detail" aria-labelledby="productTitle">
      <div className="container">
        <div className="product-detail__grid">
          <div className="product-detail__gallery">
            <div className="product-detail__image-wrapper">
              <img src={imagen} alt={nombre} className="product-detail__image" />
              <span className="product-detail__badge">Pieza de Autor · Hecho a mano</span>
            </div>
          </div>

          <div className="product-detail__info">
            <p className="product-detail__category">{categoria}</p>
            <h1 id="productTitle" className="product-detail__title">{nombre}</h1>
            <p className="product-detail__material">{material}</p>

            <div className="product-detail__price-box">
              <span className="product-detail__price">{formatPrice(precio)}</span>
              <span className="product-detail__price-note">IVA incluido · Factura A o B</span>
            </div>

            <div className="product-detail__description">
              <p>{descripcion}</p>
            </div>

            {destacados.length > 0 && (
              <ul className="product-detail__highlights">
                {destacados.map((d) => (
                  <li key={d}>
                    <span className="highlight-check">✦</span> {d}
                  </li>
                ))}
              </ul>
            )}

            <div className="product-detail__actions">
              <div className="quantity-control" aria-label="Seleccionar cantidad">
                <button
                  type="button"
                  className="quantity-control__btn"
                  aria-label="Disminuir cantidad"
                  onClick={() => cambiarCantidad(cantidad - 1)}
                >
                  −
                </button>
                <input
                  type="number"
                  className="quantity-control__input"
                  value={cantidad}
                  min="1"
                  max="10"
                  aria-label="Cantidad de unidades"
                  onChange={(e) => cambiarCantidad(e.target.value)}
                />
                <button
                  type="button"
                  className="quantity-control__btn"
                  aria-label="Aumentar cantidad"
                  onClick={() => cambiarCantidad(cantidad + 1)}
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className="btn btn--primary product-detail__buy-btn"
                onClick={() => onAgregar?.(producto, cantidad)}
              >
                <span aria-hidden="true">🛒</span> Agregar al carrito
              </button>
            </div>

            <div className="product-detail__trust-badges">
              <div className="trust-badge">
                <span className="trust-badge__icon">🛡️</span>
                <div>
                  <strong>Programa Herencia Viva</strong>
                  <p>10 años de garantía estructural y servicio de mantenimiento.</p>
                </div>
              </div>
              <div className="trust-badge">
                <span className="trust-badge__icon">🌿</span>
                <div>
                  <strong>Madera Certificada FSC®</strong>
                  <p>Especies nativas sustentables y acabados libres de tóxicos.</p>
                </div>
              </div>
              <div className="trust-badge">
                <span className="trust-badge__icon">🚛</span>
                <div>
                  <strong>Envío cuidadoso</strong>
                  <p>Embalaje 100% libre de plásticos y entrega con personal propio.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="crafting-section" aria-labelledby="craftingTitle">
          <div className="crafting-section__header">
            <span className="crafting-section__eyebrow">Oficio y Maestría</span>
            <h2 id="craftingTitle" className="crafting-section__title">
              Detalles de Fabricación
            </h2>
            <p className="crafting-section__narrative">{fabricacion}</p>
          </div>

          <dl className="specs-grid">
            {Object.entries(especificaciones).map(([clave, valor]) => (
              <div className="spec-card" key={clave}>
                <dt className="spec-card__term">{clave}</dt>
                <dd className="spec-card__detail">{valor}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </section>
  );
}

export default ProductDetail;