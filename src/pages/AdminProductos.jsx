import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import { getProductos, deleteProducto } from "../services/productService";

function AdminProductos({ onProductoModificado }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [eliminandoId, setEliminandoId] = useState(null);

  // Cargar productos desde la API
  const cargarProductos = async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await getProductos();
      setProductos(data);
      setCargando(false);
    } catch (err) {
      setError(err.message || "Error al conectar con la base de datos.");
      setCargando(false);
    }
  };

  useEffect(() => {
    document.title = "Panel de Administración | Hermanos Jota";
    cargarProductos();
  }, []);

  // Manejar eliminación con confirmación previa
  const handleEliminar = async (producto) => {
    const id = producto.id !== undefined ? producto.id : producto._id;
    const nombre = producto.name || producto.nombre || "esta pieza";

    const confirmacion = window.confirm(
      `¿Estás seguro de que deseas eliminar permanentemente "${nombre}"?\nEsta acción modificará la base de datos y no se puede deshacer.`
    );

    if (!confirmacion) {
      return;
    }

    setEliminandoId(id);
    setError(null);
    setMensajeExito(null);

    try {
      await deleteProducto(id);
      // Actualizar estado local inmediatamente
      setProductos((prev) => prev.filter((p) => (p.id !== id && p._id !== id)));
      setMensajeExito(`¡"${nombre}" ha sido eliminado con éxito de la base de datos!`);

      if (onProductoModificado) {
        onProductoModificado();
      }

      // Auto-ocultar mensaje después de 4 segundos
      setTimeout(() => {
        setMensajeExito(null);
      }, 4000);
    } catch (err) {
      setError(err.message || "Ocurrió un error al intentar eliminar el producto.");
    } finally {
      setEliminandoId(null);
    }
  };

  // Filtrado de productos por texto
  const productosFiltrados = productos.filter((p) => {
    const texto = filtro.toLowerCase();
    const nombre = (p.name || p.nombre || "").toLowerCase();
    const categoria = (p.category || p.categoria || "").toLowerCase();
    const material = (p.material || "").toLowerCase();
    return nombre.includes(texto) || categoria.includes(texto) || material.includes(texto);
  });

  return (
    <>
      <Hero
        eyebrow="Panel de Control · Administración"
        titulo="Gestión de Catálogo"
        subtitulo="Administrá el inventario en tiempo real: creá nuevas piezas, actualizá precios y eliminá productos de la base de datos."
        compacto
      />

      <section className="admin-page">
        <div className="container">
          {/* Barra superior de herramientas: Búsqueda y Botón Crear */}
          <div className="admin-toolbar">
            <div className="admin-toolbar__search">
              <input
                type="text"
                className="admin-form__input admin-toolbar__input"
                placeholder="Buscar por nombre, categoría o material..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
              {filtro && (
                <button
                  type="button"
                  className="admin-toolbar__clear"
                  onClick={() => setFiltro("")}
                  title="Limpiar búsqueda"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="admin-toolbar__actions">
              <Link to="/productos" className="btn btn--secondary btn--small">
                Ver Catálogo Público
              </Link>
              <Link to="/admin/crear-producto" className="btn btn--primary btn--small">
                + Crear Nuevo Producto
              </Link>
            </div>
          </div>

          {/* Notificación de Error */}
          {error && (
            <div className="admin-alert admin-alert--error" role="alert">
              <span className="admin-alert__icon">⚠️</span>
              <div className="admin-alert__content">
                <strong>Error:</strong>
                <p>{error}</p>
              </div>
              <button
                type="button"
                className="admin-alert__close"
                onClick={() => setError(null)}
                aria-label="Cerrar notificación"
              >
                ✕
              </button>
            </div>
          )}

          {/* Notificación de Éxito */}
          {mensajeExito && (
            <div className="admin-alert admin-alert--success" role="status">
              <span className="admin-alert__icon">✓</span>
              <div className="admin-alert__content">
                <strong>Operación completada:</strong>
                <p>{mensajeExito}</p>
              </div>
              <button
                type="button"
                className="admin-alert__close"
                onClick={() => setMensajeExito(null)}
                aria-label="Cerrar notificación"
              >
                ✕
              </button>
            </div>
          )}

          {/* Estado de carga */}
          {cargando && (
            <div className="admin-page__loading">
              <p>Conectando con la base de datos y cargando productos...</p>
            </div>
          )}

          {/* Tabla de Productos */}
          {!cargando && (
            <div className="admin-table-container">
              {productosFiltrados.length === 0 ? (
                <div className="admin-table__empty">
                  <p>
                    {filtro
                      ? `No se encontraron productos que coincidan con "${filtro}".`
                      : "No hay productos registrados en la base de datos actualmente."}
                  </p>
                  <Link to="/admin/crear-producto" className="btn btn--primary btn--small">
                    Dar de alta el primer producto
                  </Link>
                </div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th scope="col" style={{ width: "80px" }}>Imagen</th>
                      <th scope="col">Nombre & Categoría</th>
                      <th scope="col">Material</th>
                      <th scope="col">Precio</th>
                      <th scope="col">Stock</th>
                      <th scope="col" style={{ textAlign: "right" }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productosFiltrados.map((p) => {
                      const id = p.id !== undefined ? p.id : p._id;
                      const nombre = p.name || p.nombre;
                      const categoria = p.category || p.categoria;
                      const precio = p.price !== undefined ? p.price : p.precio;
                      const imagen = p.image || p.imageUrl || "/images/products/sillon-copacabana.png";
                      const estaEliminando = eliminandoId === id;

                      return (
                        <tr key={id} className={estaEliminando ? "admin-table__row--deleting" : ""}>
                          <td>
                            <div className="admin-table__img-wrapper">
                              <img
                                src={imagen}
                                alt={nombre}
                                className="admin-table__img"
                                onError={(e) => {
                                  e.target.src = "/images/products/sillon-copacabana.png";
                                }}
                              />
                            </div>
                          </td>
                          <td>
                            <div className="admin-table__product-info">
                              <strong className="admin-table__product-name">{nombre}</strong>
                              <span className="admin-table__category-badge">{categoria}</span>
                            </div>
                          </td>
                          <td className="admin-table__material">
                            {p.material || "—"}
                          </td>
                          <td className="admin-table__price">
                            ${Number(precio).toLocaleString("es-AR")}
                          </td>
                          <td>
                            <span className={`admin-table__stock ${Number(p.stock) === 0 ? "admin-table__stock--zero" : ""}`}>
                              {p.stock !== undefined ? `${p.stock} u.` : "—"}
                            </span>
                          </td>
                          <td>
                            <div className="admin-table__actions">
                              <Link
                                to={`/productos/${id}`}
                                className="btn btn--outline btn--small admin-action-btn"
                                title="Ver en tienda"
                              >
                                Ver
                              </Link>
                              <Link
                                to={`/admin/editar-producto/${id}`}
                                className="btn btn--secondary btn--small admin-action-btn"
                                title="Editar producto"
                              >
                                ✎ Editar
                              </Link>
                              <button
                                type="button"
                                className="btn btn--danger btn--small admin-action-btn"
                                onClick={() => handleEliminar(p)}
                                disabled={estaEliminando}
                                title="Eliminar producto con confirmación"
                              >
                                {estaEliminando ? "..." : "🗑 Eliminar"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default AdminProductos;
