import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const formatPrice = (precio) =>
  Number(precio).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });

function ProductDetail({ producto, onAgregar }) {
  const {
    id,
    _id,
    name: nombre,
    category: categoria,
    material,
    price: precio,
    imageUrl: imagen,
    description: descripcion,
    highlights: destacados = [],
    manufacturing: fabricacion,
    specs: especificaciones = {},
  } = producto;

  const stock = Number(producto.stock !== undefined ? producto.stock : 5);
  const sinStock = stock <= 0;

  const [cantidad, setCantidad] = useState(sinStock ? 0 : 1);
  const [agregado, setAgregado] = useState(false);

  // Sincronizar cantidad si cambia el producto
  useEffect(() => {
    setCantidad(sinStock ? 0 : 1);
    setAgregado(false);
  }, [producto.id, producto._id, sinStock]);

  const cambiarCantidad = (valor) => {
    if (sinStock) {
      setCantidad(0);
      return;
    }
    const n = parseInt(valor, 10);
    if (isNaN(n) || n < 1) {
      setCantidad(1);
    } else if (n > stock) {
      setCantidad(stock);
    } else {
      setCantidad(n);
    }
  };

  const handleAgregar = () => {
    if (sinStock || cantidad <= 0) return;
    if (cantidad > stock) {
      alert(`No podés agregar más de ${stock} unidades (stock máximo disponible).`);
      return;
    }

    const exito = onAgregar?.(producto, cantidad);
    if (exito !== false) {
      setAgregado(true);
      setTimeout(() => setAgregado(false), 1500);
    }
  };

  const productoId = id !== undefined ? id : _id;

  return (
    <section className="product-detail" aria-labelledby="productTitle">
      <div className="container">
        <div className="product-detail__grid">
          <div className="product-detail__gallery">
            <div className="product-detail__image-wrapper">
              <img src={imagen} alt={nombre} className="product-detail__image" />
              <span className="product-detail__badge">Pieza de Autor · Hecho a mano</span>
              {sinStock && (
                <span className="product-detail__stock-overlay">
                  Agotado
                </span>
              )}
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

            {/* Indicador visual de disponibilidad y stock */}
            <div className={`stock-status-banner ${sinStock ? "stock-status-banner--out" : "stock-status-banner--in"}`}>
              {sinStock ? (
                <>
                  <span className="stock-status-icon">⚠️</span>
                  <span><strong>Sin stock disponible:</strong> Esta pieza se encuentra actualmente agotada.</span>
                </>
              ) : (
                <>
                  <span className="stock-status-icon">✓</span>
                  <span>Stock disponible: <strong>{stock} {stock === 1 ? "unidad" : "unidades"}</strong></span>
                </>
              )}
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
              {/* Control de cantidad con límites según stock */}
              <div
                className={`quantity-control ${sinStock ? "quantity-control--disabled" : ""}`}
                aria-label="Seleccionar cantidad"
              >
                <button
                  type="button"
                  className="quantity-control__btn"
                  aria-label="Disminuir cantidad"
                  onClick={() => cambiarCantidad(cantidad - 1)}
                  disabled={sinStock || cantidad <= 1}
                >
                  −
                </button>
                <input
                  type="number"
                  className="quantity-control__input"
                  value={cantidad}
                  min={sinStock ? 0 : 1}
                  max={stock}
                  disabled={sinStock}
                  aria-label="Cantidad de unidades"
                  onChange={(e) => cambiarCantidad(e.target.value)}
                />
                <button
                  type="button"
                  className="quantity-control__btn"
                  aria-label="Aumentar cantidad"
                  onClick={() => cambiarCantidad(cantidad + 1)}
                  disabled={sinStock || cantidad >= stock}
                  title={cantidad >= stock ? `Límite de stock alcanzado (${stock})` : "Aumentar cantidad"}
                >
                  +
                </button>
              </div>

              {/* Botón de compra / agregar */}
              <button
                type="button"
                className={`btn ${sinStock ? "btn--disabled" : "btn--primary"} product-detail__buy-btn`}
                onClick={handleAgregar}
                disabled={sinStock}
                title={sinStock ? "Esta pieza no tiene stock disponible" : "Agregar al carrito"}
              >
                <span aria-hidden="true">{sinStock ? "🚫" : agregado ? "✓" : "🛒"}</span>{" "}
                {sinStock
                  ? "Sin stock disponible"
                  : agregado
                  ? "¡Agregado al carrito!"
                  : "Agregar al carrito"}
              </button>

              <Link
                to={`/admin/editar-producto/${productoId}`}
                className="btn btn--secondary btn--small"
                title="Editar esta pieza en el panel de administración"
              >
                ✎ Editar pieza
              </Link>
            </div>

            {/* Aviso si la cantidad seleccionada alcanza el stock total */}
            {!sinStock && cantidad >= stock && stock > 0 && (
              <p className="product-detail__stock-limit-note">
                ℹ️ Seleccionaste el total de unidades disponibles ({stock} u.).
              </p>
            )}

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
