
import { useState } from "react";

const formatPrice = (price) =>
  Number(price).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });

function ProductDetail({ producto }) {
  const [cantidad, setCantidad] = useState(1);

  const { name, description, price, imageUrl, stock } = producto;

  const cambiarCantidad = (valor) => {
  const numero = parseInt(valor, 10);
  const maximo = Math.min(10, stock);

  setCantidad(Math.min(maximo, Math.max(1, numero || 1)));
};

  return (
    <section className="product-detail" aria-labelledby="productTitle">
      <div className="container">
        <div className="product-detail__grid">
          <div className="product-detail__gallery">
            <div className="product-detail__image-wrapper">
              <img
                src={imageUrl}
                alt={name}
                className="product-detail__image"
              />
              <span className="product-detail__badge">
                Hermanos Jota
              </span>
            </div>
          </div>

          <div className="product-detail__info">
            <h1 id="productTitle" className="product-detail__title">
              {name}
            </h1>

            <div className="product-detail__price-box">
              <span className="product-detail__price">
                {formatPrice(price)}
              </span>
              <span className="product-detail__price-note">
                IVA incluido · Factura A o B
              </span>
            </div>

            <div className="product-detail__description">
              <p>{description}</p>
            </div>

            <p className="product-detail__stock">
              {stock > 0
                ? `Unidades disponibles: ${stock}`
                : "Producto sin stock"}
            </p>

            <div className="product-detail__actions">
              <div
                className="quantity-control"
                aria-label="Seleccionar cantidad"
              >
                <button
                  type="button"
                  className="quantity-control__btn"
                  aria-label="Disminuir cantidad"
                  onClick={() => cambiarCantidad(cantidad - 1)}
                  disabled={cantidad <= 1}
                >
                  −
                </button>

                <input
                  type="number"
                  className="quantity-control__input"
                  value={cantidad}
                  min="1"
                  max={Math.min(10, stock || 1)}
                  aria-label="Cantidad de unidades"
                  onChange={(e) => cambiarCantidad(e.target.value)}
                />

                <button
                  type="button"
                  className="quantity-control__btn"
                  aria-label="Aumentar cantidad"
                  onClick={() => cambiarCantidad(cantidad + 1)}
                  disabled={cantidad >= Math.min(10, stock)}
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className="btn btn--primary product-detail__buy-btn"
                disabled={!stock || stock <= 0}
              >
                <span aria-hidden="true">🛒</span>
                Agregar al carrito
              </button>
            </div>

            <div className="product-detail__trust-badges">
              <div className="trust-badge">
                <span className="trust-badge__icon">🛡️</span>
                <div>
                  <strong>Calidad y durabilidad</strong>
                  <p>Diseños pensados para acompañarte durante años.</p>
                </div>
              </div>

              <div className="trust-badge">
                <span className="trust-badge__icon">🌿</span>
                <div>
                  <strong>Compromiso sustentable</strong>
                  <p>Valoramos el uso responsable de los materiales.</p>
                </div>
              </div>

              <div className="trust-badge">
                <span className="trust-badge__icon">🚛</span>
                <div>
                  <strong>Envíos</strong>
                  <p>Consultá las opciones de entrega disponibles.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;
