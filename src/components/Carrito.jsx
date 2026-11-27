import { Link } from "react-router-dom";
import useCart from "../context/useCart";
import CheckoutButton from "./CheckoutButton";

/**
 * Carrito (modal) — adaptado para usar CartContext global.
 * Alerta sobre faltantes de stock y bloquea la compra si no hay disponibilidad.
 */
function Carrito({ onCerrar }) {
  const {
    carrito,
    eliminarDelCarrito,
    vaciarCarrito,
    cambiarCantidad,
    total,
    alertasStock,
    hayProblemasDeStock,
  } = useCart();

  return (
    <div className="cart-overlay" onClick={onCerrar}>
      {/* Evitamos que el clic dentro del modal lo cierre */}
      <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
        {/* Cabecera */}
        <div className="cart-modal__header">
          <h2>Tu Carrito</h2>
          <button
            type="button"
            className="cart-modal__close-btn"
            onClick={onCerrar}
            aria-label="Cerrar carrito"
          >
            ✕
          </button>
        </div>

        {/* Banner de alertas de inventario */}
        {alertasStock && alertasStock.length > 0 && (
          <div className="cart-stock-banner" role="alert">
            <span aria-hidden="true">⚠️</span>
            <div className="cart-stock-banner__content">
              <strong>Actualización de stock:</strong>
              <ul>
                {alertasStock.map((alerta, idx) => (
                  <li key={idx}>{alerta}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Cuerpo */}
        <div className="cart-modal__body">
          {carrito.length === 0 ? (
            <div className="cart-modal__empty">
              <span className="cart-modal__empty-icon" aria-hidden="true">
                🛒
              </span>
              <p>Tu carrito está vacío.</p>
              <Link
                to="/productos"
                className="btn btn--primary btn--small"
                onClick={onCerrar}
              >
                Explorar productos
              </Link>
            </div>
          ) : (
            <ul className="cart-modal__list">
              {carrito.map((item) => {
                const nombre = item.name || item.nombre;
                const precio = Number(item.price ?? item.precio ?? 0);
                const imagen =
                  item.image || item.imageUrl || item.imagen;
                const stockItem =
                  item.stock !== undefined ? Number(item.stock) : 5;
                const sinStock = stockItem <= 0;
                const superaStock = item.cantidad > stockItem && !sinStock;
                const alMaximoStock = item.cantidad >= stockItem;

                return (
                  <li
                    key={item.id ?? item._id}
                    className={`cart-item ${sinStock ? "cart-item--sin-stock" : ""}`}
                  >
                    <img
                      src={imagen}
                      alt={nombre}
                      className="cart-item__image"
                      onError={(e) => {
                        e.target.src =
                          "/images/products/sillon-copacabana.png";
                      }}
                    />
                    <div className="cart-item__details">
                      <div className="cart-item__header-row">
                        <h3 className="cart-item__name">{nombre}</h3>
                        {sinStock && (
                          <span className="cart-item__stock-badge cart-item__stock-badge--out">
                            Agotado
                          </span>
                        )}
                        {superaStock && (
                          <span className="cart-item__stock-badge cart-item__stock-badge--warn">
                            Excede stock
                          </span>
                        )}
                      </div>

                      <p className="cart-item__price">
                        ${precio.toLocaleString("es-AR")} c/u
                      </p>

                      <div className="cart-item__qty-wrapper">
                        <div className="cart-item__qty-controls">
                          <button
                            type="button"
                            className="cart-item__qty-btn"
                            onClick={() =>
                              cambiarCantidad(
                                item.id ?? item._id,
                                item.cantidad - 1
                              )
                            }
                            disabled={item.cantidad <= 1}
                            aria-label="Disminuir cantidad"
                          >
                            −
                          </button>
                          <span className="cart-item__qty-number">
                            {item.cantidad}
                          </span>
                          <button
                            type="button"
                            className="cart-item__qty-btn"
                            onClick={() =>
                              cambiarCantidad(
                                item.id ?? item._id,
                                item.cantidad + 1
                              )
                            }
                            disabled={alMaximoStock || sinStock}
                            aria-label="Aumentar cantidad"
                            title={
                              sinStock
                                ? "Producto sin stock disponible"
                                : alMaximoStock
                                ? "Stock máximo alcanzado"
                                : "Aumentar cantidad"
                            }
                          >
                            +
                          </button>
                        </div>
                        <span
                          className={`cart-item__stock-indicator ${
                            sinStock ? "cart-item__stock-indicator--out" : ""
                          }`}
                        >
                          {sinStock ? "(0 disponibles)" : `(máx. ${stockItem} u.)`}
                        </span>
                      </div>

                      <p className="cart-item__subtotal">
                        Subtotal: ${(precio * item.cantidad).toLocaleString("es-AR")}
                      </p>
                    </div>

                    <button
                      type="button"
                      className="cart-item__delete-btn"
                      onClick={() => eliminarDelCarrito(item.id ?? item._id)}
                      aria-label={`Eliminar ${nombre} del carrito`}
                      title="Eliminar producto"
                    >
                      🗑
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer del carrito */}
        {carrito.length > 0 && (
          <div className="cart-modal__footer">
            <div className="cart-modal__total">
              <span>Total:</span>
              <strong>${total.toLocaleString("es-AR")}</strong>
            </div>

            <div className="cart-modal__actions">
              <button
                type="button"
                className="btn btn--outline btn--small"
                onClick={vaciarCarrito}
              >
                Vaciar carrito
              </button>
              <Link
                to="/carrito"
                className="btn btn--outline btn--small"
                onClick={onCerrar}
              >
                Ver detalle
              </Link>
            </div>

            {/* Aviso si hay ítems con problemas de stock */}
            {hayProblemasDeStock && (
              <p className="summary-stock-warning" role="alert">
                ⚠️ Hay productos sin stock. Ajustá las cantidades para comprar.
              </p>
            )}

            {/* Botón de checkout con bloqueo por falta de stock */}
            <CheckoutButton onCerrarCarrito={onCerrar} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Carrito;
