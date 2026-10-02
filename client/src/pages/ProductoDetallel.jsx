import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ProductDetail from "../components/ProductDetail";
import ProductCard from "../components/ProductCard";

function ProductoDetalle({ productos = [], onAgregar }) {
  const { id } = useParams();
  const producto = productos.find((p) => p.id === Number(id));

  // Reemplaza el pageTitle que cambiabas a mano en el JS viejo
  useEffect(() => {
if (producto) document.title = `${producto.name} | Hermanos Jota`;
    return () => {
      document.title = "Hermanos Jota";
    };
  }, [producto]);

  if (productos.length === 0) {
    return (
      <section className="product-detail">
        <div className="container">
          <p className="products-grid__loading">Cargando detalles de la pieza...</p>
        </div>
      </section>
    );
  }

  if (!producto) {
    return (
      <section className="product-detail">
        <div className="container product-detail__not-found">
          <h2>Pieza no encontrada</h2>
          <p>La pieza que estás buscando no se encuentra disponible o el enlace no es válido.</p>
          <Link to="/productos" className="btn btn--primary">Volver a productos</Link>
        </div>
      </section>
    );
  }

  const relacionados = productos.filter((p) => p.id !== producto.id).slice(0, 3);

  return (
    <>
      {/* key = id: al pasar a otra pieza, la cantidad vuelve a 1 */}
      <ProductDetail key={producto.id} producto={producto} onAgregar={onAgregar} />

      <section className="related-products" aria-labelledby="relatedTitle">
        <div className="container">
          <h2 id="relatedTitle" className="section-title">Otras piezas de la colección</h2>
          <p className="section-subtitle">
            Diseños creados bajo la misma filosofía de honestidad de materiales y herencia artesanal.
          </p>
          <div className="products-grid">
            {relacionados.map((p) => (
              <ProductCard key={p.id} producto={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default ProductoDetalle;