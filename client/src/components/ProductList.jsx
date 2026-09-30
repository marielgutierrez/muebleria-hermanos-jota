import ProductCard from "./ProductCard";

function ProductList({ productos,titulo }) {
  return (
   <section className="product-section">
      <section className="featured">
      <div className="container">
        {titulo && <h2 className="section-title">{titulo}</h2>}


  <div className="product-grid">
    {productos.map((producto) => (
      <ProductCard
        key={producto.id}
        nombre={producto.nombre}
        precio={producto.precio}
        imagen={producto.imagen}
      />
    ))}
    </div>
  </div>
  </section>
</section>
  );
}

export default ProductList;