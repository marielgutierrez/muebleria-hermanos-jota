import { Link } from "react-router-dom";

function ProductCard({ producto, onAgregar }) {
  const finalId = producto.id !== undefined ? producto.id : producto._id;
  const finalName = producto.name || producto.nombre || "Pieza Hermanos Jota";
  const finalCategory = producto.category || producto.categoria || "Mueble";
  const finalMaterial = producto.material || "";
  const finalDescription = producto.description || producto.descripcion || "";
  const finalPrice = producto.price !== undefined ? producto.price : producto.precio;
  const finalImage = producto.image || producto.imageUrl || "/images/products/sillon-copacabana.png";

  const stock = Number(producto.stock !== undefined ? producto.stock : 5);
  const sinStock = stock <= 0;

  return (
    <article className={`product-card ${sinStock ? "product-card--out-of-stock" : ""}`}>
      <Link to={`/productos/${finalId}`} className="product-card__image-wrap">
        <img
          className="product-card__image"
          src={finalImage}
          alt={finalName}
          loading="lazy"
          onError={(e) => {
            e.target.src = "/images/products/sillon-copacabana.png";
          }}
        />
        {sinStock && (
          <span className="product-card__stock-badge product-card__stock-badge--out">
            Agotado
          </span>
        )}
      </Link>

      <div className="product-card__body">
        <div className="product-card__header-meta">
          <p className="product-card__category">{finalCategory}</p>
          <span className={`product-card__stock-pill ${sinStock ? "stock-pill--out" : "stock-pill--ok"}`}>
            {sinStock ? "Sin stock" : `${stock} disp.`}
          </span>
        </div>

        <h3 className="product-card__name">{finalName}</h3>
        {finalMaterial && <p className="product-card__material">{finalMaterial}</p>}
        {finalDescription && <p className="product-card__description">{finalDescription}</p>}

        <div className="product-card__footer">
          <span className="product-card__price">
            ${Number(finalPrice || 0).toLocaleString("es-AR")}
          </span>

          <div className="product-card__actions">
            <Link to={`/productos/${finalId}`} className="btn btn--outline btn--small">
              Ver detalle
            </Link>
            <button
              type="button"
              className={`btn btn--small ${sinStock ? "btn--disabled" : "btn--primary"}`}
              onClick={() => {
                if (!sinStock) {
                  onAgregar?.(producto);
                }
              }}
              disabled={sinStock}
              title={sinStock ? "Producto sin stock disponible" : `Agregar al carrito (${stock} disponibles)`}
            >
              {sinStock ? "Agotado" : "Agregar"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
