import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import Hero from "../components/Hero";
import { createProducto } from "../services/productService";

function AdminCrearProducto({ onProductoCreado }) {
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(null);

  useEffect(() => {
    document.title = "Alta de Producto | Panel Admin Hermanos Jota";
  }, []);

  const handleCrear = async (nuevoProductoData) => {
    setCargando(true);
    setError(null);
    setExito(null);

    try {
      const productoGuardado = await createProducto(nuevoProductoData);
      setExito("¡Producto creado con éxito en la base de datos! Redirigiendo...");

      if (onProductoCreado) {
        onProductoCreado(productoGuardado);
      }

      // Redirigir al catálogo o al panel admin tras 1.2 segundos para mostrar el mensaje de éxito
      setTimeout(() => {
        navigate("/admin/productos");
      }, 1200);
    } catch (err) {
      setError(err.message || "Ocurrió un error inesperado al intentar crear el producto.");
      setCargando(false);
    }
  };

  return (
    <>
      <Hero
        eyebrow="Panel Administrativo · Gestión de Catálogo"
        titulo="Alta de Nueva Pieza"
        subtitulo="Completá el formulario para registrar una nueva pieza de mobiliario en el catálogo oficial de Hermanos Jota."
        compacto
      />

      <section className="admin-page">
        <div className="container">
          <div className="admin-page__header">
            <div className="admin-page__nav-actions">
              <Link to="/admin/productos" className="btn btn--secondary btn--small">
                ← Volver al Panel Admin
              </Link>
              <Link to="/productos" className="btn btn--outline btn--small">
                Ver Catálogo Público
              </Link>
            </div>
          </div>

          {/* Notificación de Error */}
          {error && (
            <div className="admin-alert admin-alert--error" role="alert">
              <span className="admin-alert__icon">⚠️</span>
              <div className="admin-alert__content">
                <strong>Error al crear el producto:</strong>
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

          <div className="admin-page__card">
            <ProductForm
              onSubmit={handleCrear}
              isEditing={false}
              cargando={cargando}
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default AdminCrearProducto;
