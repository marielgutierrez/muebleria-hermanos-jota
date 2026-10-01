import { Link } from "react-router-dom"
function ProductCard({ producto, onAgregar }) {
  const { id, name, category, material, description, price, image } = producto;

  return (
    <article className="product-card">
       <Link to={`/productos/${id}`} className="product-card__image-wrap">
        <img className="product-card__image" src={image} alt={name} loading="lazy" />
      </Link>

      <div className="product-card__body">
        <p className="product-card__category">{category}</p>
        <h3 className="product-card__name">{name}</h3>
        <p className="product-card__material">{material}</p>
        <p className="product-card__description">{description}</p>

        <div className="product-card__footer">
          <span className="product-card__price">
            ${Number(price).toLocaleString("es-AR")}
          </span>

          <div className="product-card__actions">
               <Link to={`/productos/${id}`} className="btn btn--outline btn--small">
              Ver detalle
            </Link>
            <button
              type="button"
              className="btn btn--primary btn--small"
              onClick={() => onAgregar?.(producto)}
            >
              Agregar
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;