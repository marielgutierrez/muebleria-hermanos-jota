
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ProductDetail from "../components/ProductDetail";
import ProductCard from "../components/ProductCard";
import { getProductById, getProducts } from "../services/productosService";

function ProductoDetalle() {
  const { id } = useParams();

  const [producto, setProducto] = useState(null);
  const [relacionados, setRelacionados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelado = false;

    async function cargarProducto() {
      try {
        setLoading(true);
        setError(null);
        setProducto(null);

        // Buscamos el producto seleccionado
        const datosProducto = await getProductById(id);

        if (cancelado) return;

        setProducto(datosProducto);

        // Buscamos otros productos para mostrar como relacionados
        try {
          const todosLosProductos = await getProducts();

          if (!cancelado) {
            setRelacionados(
              todosLosProductos
                .filter((p) => p._id !== datosProducto._id)
                .slice(0, 3)
            );
          }
        } catch {
          
          // Si falla la búsqueda de relacionados,
          // igualmente mostramos el producto principal.
          setRelacionados([]);
        }
      } catch (error) {
        if (!cancelado) {
          setError(error.message);
        }
      } finally {
        if (!cancelado) {
          setLoading(false);
        }
      }
    }

    cargarProducto();

    return () => {
      cancelado = true;
    };
  }, [id]);

  useEffect(() => {
    if (producto) {
      document.title = `${producto.name} | Hermanos Jota`;
    } else {
      document.title = "Hermanos Jota";
    }

    return () => {
      document.title = "Hermanos Jota";
    };
  }, [producto]);

  if (loading) {
    return (
      <section className="product-detail">
        <div className="container">
          <p className="products-grid__loading">
            Cargando detalles de la pieza...
          </p>
        </div>
      </section>
    );
  }

  if (error || !producto) {
    return (
      <section className="product-detail">
        <div className="container product-detail__not-found">
          <h2>Pieza no encontrada</h2>
          <p>
            {error
              ? "No pudimos cargar este producto. Intentá nuevamente más tarde."
              : "La pieza que estás buscando no se encuentra disponible o el enlace no es válido."}
          </p>
          <Link to="/productos" className="btn btn--primary">
            Volver a productos
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <ProductDetail
        key={producto._id}
        producto={producto}
      />

      {relacionados.length > 0 && (
        <section className="related-products" aria-labelledby="relatedTitle">
          <div className="container">
            <h2 id="relatedTitle" className="section-title">
              Otras piezas de la colección
            </h2>
            <p className="section-subtitle">
              Diseños creados bajo la misma filosofía de honestidad de
              materiales y herencia artesanal.
            </p>

            <div className="products-grid">
              {relacionados.map((p) => (
                <ProductCard key={p._id} producto={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default ProductoDetalle;
