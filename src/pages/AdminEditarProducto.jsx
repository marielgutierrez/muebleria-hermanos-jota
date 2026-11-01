import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import Hero from "../components/Hero";
import { getProductoById, updateProducto } from "../services/productService";

function AdminEditarProducto({ onProductoActualizado }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [producto, setProducto] = useState(null);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [cargandoEnvio, setCargandoEnvio] = useState(false);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(null);

  // Cargar datos del producto a editar por ID
  useEffect(() => {
    let cancelado = false;
    setCargandoDatos(true);
    setError(null);

    getProductoById(id)
      .then((data) => {
        if (!cancelado) {
          setProducto(data);
          document.title = `Editar: ${data.name || data.nombre} | Admin`;
          setCargandoDatos(false);
        }
      })
      .catch((err) => {
        if (!cancelado) {
          setError(err.message || "No se pudo cargar la información del producto.");
          setCargandoDatos(false);
        }
      });

    return () => {
      cancelado = true;
    };
  }, [id]);

  // Manejar el PUT para guardar los cambios
  const handleEditar = async (datosActualizados) => {
    setCargandoEnvio(true);
    setError(null);
    setExito(null);

    try {
      const productoGuardado = await updateProducto(id, datosActualizados);
      setExito("¡Producto actualizado con éxito en la base de datos! Redirigiendo...");

      if (onProductoActualizado) {
        onProductoActualizado(productoGuardado);
      }

      // Redirigir al detalle del producto o al panel admin tras 1.2 segundos
      setTimeout(() => {
        navigate(`/productos/${id}`);
      }, 1200);
    } catch (err) {
      setError(err.message || "Ocurrió un error al intentar actualizar el producto.");
      setCargandoEnvio(false);
    }
  };

  return (
    <>
      <Hero
        eyebrow="Panel Administrativo · Edición de Pieza"
        titulo={producto ? `Editar: ${producto.name || producto.nombre}` : "Editar Producto"}
        subtitulo="Modificá las especificaciones, precio o descripción del producto para mantener el catálogo al día."
        compacto
      />

      <section className="admin-page">
        <div className="container">
          <div className="admin-page__header">
            <div className="admin-page__nav-actions">
              <Link to="/admin/productos" className="btn btn--secondary btn--small">
                ← Volver al Panel Admin
              </Link>
              {producto && (
                <Link to={`/productos/${id}`} className="btn btn--outline btn--small">
                  Ver Detalle Público
                </Link>
              )}
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
          {exito && (
            <div className="admin-alert admin-alert--success" role="status">
              <span className="admin-alert__icon">✓</span>
              <div className="admin-alert__content">
                <strong>Operación exitosa:</strong>
                <p>{exito}</p>
              </div>
            </div>
          )}

          {/* Estado de carga inicial de datos */}
          {cargandoDatos && (
            <div className="admin-page__loading">
              <p>Cargando información de la pieza...</p>
            </div>
          )}

          {/* Si no se encontró el producto */}
          {!cargandoDatos && !producto && !error && (
            <div className="admin-page__not-found">
              <h3>Producto no encontrado</h3>
              <p>No se encontró ninguna pieza registrada con el identificador #{id}.</p>
              <Link to="/admin/productos" className="btn btn--primary">
                Volver al listado
              </Link>
            </div>
          )}

          {/* Formulario reutilizable */}
          {!cargandoDatos && producto && (
            <div className="admin-page__card">
              <ProductForm
                productoInicial={producto}
                onSubmit={handleEditar}
                isEditing={true}
                cargando={cargandoEnvio}
              />
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default AdminEditarProducto;
