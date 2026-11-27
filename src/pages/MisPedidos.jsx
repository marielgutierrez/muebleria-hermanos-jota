import { useState, useEffect } from "react";
import { obtenerPedidos } from "../services/orderService";

/**
 * Formatea una fecha ISO a string legible en español.
 * @param {string} fechaIso
 * @returns {string}
 */
function formatearFecha(fechaIso) {
  if (!fechaIso) return "—";
  try {
    return new Date(fechaIso).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return fechaIso;
  }
}

/**
 * Página /mis-pedidos — historial de pedidos del usuario.
 * Carga todos los pedidos sin requerir login.
 */
function MisPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelado = false;

    async function cargar() {
      try {
        const data = await obtenerPedidos();
        if (!cancelado) {
          setPedidos(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!cancelado) {
          setError(err.message || "No se pudieron cargar los pedidos.");
        }
      } finally {
        if (!cancelado) setCargando(false);
      }
    }

    cargar();
    return () => { cancelado = true; };
  }, []);

  /* ── Estados de UI ─────────────────────────────────────────────────── */
  if (cargando) {
    return (
      <section className="mis-pedidos-page container">
        <h1 className="mis-pedidos-page__title">Mis pedidos</h1>
        <div className="mis-pedidos-page__loading">
          <span className="spinner" aria-hidden="true">⏳</span>
          <p>Cargando tus pedidos…</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mis-pedidos-page container">
        <h1 className="mis-pedidos-page__title">Mis pedidos</h1>
        <div className="mis-pedidos-page__error" role="alert">
          <p>⚠️ {error}</p>
          <button
            type="button"
            className="btn btn--outline btn--small"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      </section>
    );
  }

  if (pedidos.length === 0) {
    return (
      <section className="mis-pedidos-page container mis-pedidos-page--empty">
        <h1 className="mis-pedidos-page__title">Mis pedidos</h1>
        <div className="mis-pedidos-page__empty">
          <span className="mis-pedidos-page__empty-icon" aria-hidden="true">📦</span>
          <p>Todavía no realizaste ningún pedido.</p>
          <a href="/productos" className="btn btn--primary btn--small">
            Explorar catálogo
          </a>
        </div>
      </section>
    );
  }

  /* ── Lista de pedidos ──────────────────────────────────────────────── */
  return (
    <section className="mis-pedidos-page container">
      <div className="mis-pedidos-page__top">
        <h1 className="mis-pedidos-page__title">Mis pedidos</h1>
        <p className="mis-pedidos-page__count">
          {pedidos.length} pedido{pedidos.length !== 1 ? "s" : ""} registrado{pedidos.length !== 1 ? "s" : ""}
        </p>
      </div>

      <ul className="pedidos-list">
        {pedidos.map((pedido) => {
          const items = pedido.items || pedido.productos || [];
          const fechaTexto = formatearFecha(pedido.createdAt || pedido.fecha);

          return (
            <li key={pedido._id || pedido.id} className="pedido-card">
              <div className="pedido-card__header">
                <span className="pedido-card__id">
                  Pedido #{(pedido._id || pedido.id || "—").toString().slice(-6).toUpperCase()}
                </span>
                <time
                  className="pedido-card__fecha"
                  dateTime={pedido.createdAt || pedido.fecha}
                >
                  {fechaTexto}
                </time>
                <span
                  className={`pedido-card__estado pedido-card__estado--${(pedido.estado || pedido.status || "pendiente").toLowerCase()}`}
                >
                  {pedido.estado || pedido.status || "Pendiente"}
                </span>
              </div>

              {/* Productos del pedido */}
              <ul className="pedido-card__items">
                {items.map((item, idx) => {
                  const nombre = item.nombre || item.name || "Producto";
                  const precio = Number(item.precio || item.price || 0);
                  const cantidad = Number(item.cantidad || item.quantity || 1);

                  return (
                    <li key={idx} className="pedido-item">
                      <span className="pedido-item__nombre">{nombre}</span>
                      <span className="pedido-item__detalle">
                        {cantidad} × ${precio.toLocaleString("es-AR")} ={" "}
                        <strong>${(precio * cantidad).toLocaleString("es-AR")}</strong>
                      </span>
                    </li>
                  );
                })}
              </ul>

              {/* Total del pedido */}
              <div className="pedido-card__footer">
                <span className="pedido-card__total-label">Total del pedido:</span>
                <strong className="pedido-card__total">
                  ${Number(pedido.total || 0).toLocaleString("es-AR")}
                </strong>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default MisPedidos;
