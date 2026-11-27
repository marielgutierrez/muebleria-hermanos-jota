import useCart from "../context/useCart";
import { Link } from "react-router-dom";
import CheckoutButton from "../components/CheckoutButton";

/**
 * Página /carrito — vista completa del carrito con tabla de productos,
 * controles de cantidad y resumen del pedido.
 * Alerta sobre faltantes de stock y bloquea la compra si no hay stock suficiente.
 */
function Carrito() {
  const {
    carrito,
    eliminarDelCarrito,
    cambiarCantidad,
    vaciarCarrito,
    subtotal,
    total,
    alertasStock,
    hayProblemasDeStock,
  } = useCart();

  if (carrito.length === 0) {
    return (
      <section className="carrito-page container carrito-page--empty">
        <h1 className="carrito-page__title">Tu carrito</h1>
        <div className="carrito-page__empty-state">
          <span aria-hidden="true" className="carrito-page__empty-icon">🛒</span>
          <p>No tenés productos en el carrito todavía.</p>
          <Link to="/productos" className="btn btn--primary">
            Explorar productos
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="carrito-page container">
      <h1 className="carrito-page__title">Tu carrito</h1>

      {/* Alerta de inventario actualizado */}
      {alertasStock && alertasStock.length > 0 && (
        <div className="cart-stock-banner cart-stock-banner--page" role="alert">
          <span className="cart-stock-banner__icon" aria-hidden="true">⚠️</span>
          <div className="cart-stock-banner__content">
            <strong>Aviso de disponibilidad de stock:</strong>
            <ul>
              {alertasStock.map((alerta, idx) => (
                <li key={idx}>{alerta}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="carrito-page__layout">
        {/* ── Tabla de productos ───────────────────────────────────────── */}
        <div className="carrito-page__items">
          <table className="carrito-table">
            <thead>
              <tr>
                <th scope="col">Producto</th>
                <th scope="col">Precio</th>
                <th scope="col">Cantidad</th>
                <th scope="col">Subtotal</th>
                <th scope="col">
                  <span className="sr-only">Eliminar</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {carrito.map((item) => {
                const id = item.id ?? item._id;
                const nombre = item.name || item.nombre || "Producto";
                const precio = Number(item.price ?? item.precio ?? 0);
                const imagen =
                  item.image || item.imageUrl || item.imagen ||
                  "/images/products/sillon-copacabana.png";
                const stock = Number(item.stock ?? 5);
                const sinStock = stock <= 0;
                const superaStock = item.cantidad > stock && !sinStock;
                const subtotalItem = precio * item.cantidad;

                return (
                  <tr
                    key={id}
                    className={`carrito-table__row ${sinStock ? "carrito-table__row--no-stock" : ""}`}
                  >
                    <td className="carrito-table__product">
                      <img
                        src={imagen}
                        alt={nombre}
                        className="carrito-table__image"
                        onError={(e) => {
                          e.target.src = "/images/products/sillon-copacabana.png";
                        }}
                      />
                      <div className="carrito-table__product-info">
                        <span className="carrito-table__name">{nombre}</span>
                        {sinStock && (
                          <span className="cart-item__stock-badge cart-item__stock-badge--out">
                            Agotado en tienda
                          </span>
                        )}
                        {superaStock && (
                          <span className="cart-item__stock-badge cart-item__stock-badge--warn">
                            Excede stock ({stock} disp.)
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="carrito-table__price">
                      ${precio.toLocaleString("es-AR")}
                    </td>

                    <td className="carrito-table__qty">
                      <div className="qty-controls">
                        <button
                          type="button"
                          className="qty-controls__btn"
                          onClick={() => cambiarCantidad(id, item.cantidad - 1)}
                          disabled={item.cantidad <= 1}
                          aria-label="Disminuir cantidad"
                        >
                          −
                        </button>
                        <span className="qty-controls__value">{item.cantidad}</span>
                        <button
                          type="button"
                          className="qty-controls__btn"
                          onClick={() => cambiarCantidad(id, item.cantidad + 1)}
                          disabled={item.cantidad >= stock || sinStock}
                          aria-label="Aumentar cantidad"
                          title={
                            sinStock
                              ? "Sin stock"
                              : item.cantidad >= stock
                              ? "Stock máximo alcanzado"
                              : ""
                          }
                        >
                          +
                        </button>
                      </div>
                      <small
                        className={`qty-controls__stock ${
                          sinStock ? "qty-controls__stock--out" : ""
                        }`}
                      >
                        {sinStock ? "Sin stock disponible" : `Disp: ${stock} u.`}
                      </small>
                    </td>

                    <td className="carrito-table__subtotal">
                      ${subtotalItem.toLocaleString("es-AR")}
                    </td>

                    <td className="carrito-table__remove">
                      <button
                        type="button"
                        className="carrito-table__remove-btn"
                        onClick={() => eliminarDelCarrito(id)}
                        aria-label={`Eliminar ${nombre}`}
                        title="Quitar del carrito"
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="carrito-page__table-actions">
            <button
              type="button"
              className="btn btn--outline btn--small"
              onClick={vaciarCarrito}
            >
              Vaciar carrito
            </button>
            <Link to="/productos" className="btn btn--outline btn--small">
              Seguir comprando
            </Link>
          </div>
        </div>

        {/* ── Resumen del pedido ───────────────────────────────────────── */}
        <aside className="carrito-page__summary">
          <h2 className="carrito-page__summary-title">Resumen del pedido</h2>

          {hayProblemasDeStock && (
            <div className="summary-stock-warning" role="alert">
              ⚠️ Ajustá los productos sin stock para poder finalizar la compra.
            </div>
          )}

          <dl className="carrito-page__summary-list">
            <div className="carrito-page__summary-row">
              <dt>Subtotal</dt>
              <dd>${subtotal.toLocaleString("es-AR")}</dd>
            </div>
            <div className="carrito-page__summary-row carrito-page__summary-row--total">
              <dt>Total</dt>
              <dd>${total.toLocaleString("es-AR")}</dd>
            </div>
          </dl>

          <CheckoutButton />
        </aside>
      </div>
    </section>
  );
}

export default Carrito;
