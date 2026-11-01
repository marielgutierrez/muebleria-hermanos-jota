import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import ProductDetail from "../components/ProductDetail";

function ProductoDetalle({ productos = [], onAgregar }) {
  const { id } = useParams();

  useEffect(() => {
    document.title = "Detalle de producto | Hermanos Jota";
  }, []);

  // Buscar el producto por id numérico o por _id string (MongoDB ObjectId)
  const producto = productos.find(
    (p) =>
      String(p.id) === String(id) ||
      String(p._id) === String(id)
  );

  if (!producto) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
        <h2>Producto no encontrado</h2>
        <p style={{ color: "#666", marginBottom: "1.5rem" }}>
          El producto que buscás no existe o fue eliminado del catálogo.
        </p>
        <Link to="/productos" className="btn btn--primary">
          Ver catálogo completo
        </Link>
      </div>
    );
  }

  return <ProductDetail producto={producto} onAgregar={onAgregar} />;
}

export default ProductoDetalle;
