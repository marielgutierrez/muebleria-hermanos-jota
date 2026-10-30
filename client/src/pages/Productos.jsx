
import { useState, useEffect } from "react";
import ProductList from "../components/ProductList";
import Hero from "../components/Hero";
import { getProducts } from "../services/productosService";

function Productos() {
  // Guardamos los productos que llegan desde la API
  const [productos, setProductos] = useState([]);

  // Controlamos si la petición está cargando
  const [loading, setLoading] = useState(true);

  // Guardamos posibles errores
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargarProductos() {
      try {
        setLoading(true);
        setError(null);

        const datos = await getProducts();

        setProductos(datos);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    cargarProductos();
  }, []);
return (
  <>
    <Hero
      eyebrow="Catálogo Oficial · Colección Completa"
      titulo="Muebles con Historia"
      subtitulo="Cada pieza es concebida y ensamblada en nuestra Casa Taller con maderas nativas argentinas, técnicas de ebanistería tradicional y acabados de bajo impacto ambiental. Hacé clic en cualquier pieza para conocer sus detalles de fabricación e historia."
    />

    {loading && (
      <section className="featured">
        <div className="container">
          <p>Cargando productos...</p>
        </div>
      </section>
    )}

    {error && (
      <section className="featured">
        <div className="container">
          <p>No pudimos cargar los productos. {error}</p>
        </div>
      </section>
    )}

    {!loading && !error && productos.length === 0 && (
      <section className="featured">
        <div className="container">
          <p>Todavía no hay productos disponibles.</p>
        </div>
      </section>
    )}

    {!loading && !error && productos.length > 0 && (
      <ProductList
        productos={productos}
        titulo="Nuestros productos"
      />
    )}
  </>
);
}

export default Productos;
