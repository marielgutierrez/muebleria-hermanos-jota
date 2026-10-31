import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CATEGORIAS = [
  "Living",
  "Almacenamiento",
  "Dormitorio",
  "Comedor",
  "Oficina",
  "Exterior",
];

const IMAGENES_SUGERIDAS = [
  { label: "Sillón Copacabana", url: "/images/products/sillon-copacabana.png" },
  { label: "Biblioteca Recoleta", url: "/images/products/biblioteca-recoleta.png" },
  { label: "Aparador Uspallata", url: "/images/products/aparador-uspallata.png" },
  { label: "Butaca Mendoza", url: "/images/products/butaca-mendoza.png" },
];

function ProductForm({
  productoInicial = null,
  onSubmit,
  isEditing = false,
  cargando = false,
}) {
  const navigate = useNavigate();

  // Estado controlado para cada campo del formulario
  const [formData, setFormData] = useState({
    name: "",
    category: "Living",
    price: "",
    description: "",
    image: "/images/products/sillon-copacabana.png",
    material: "",
    measurements: "",
    stock: 1,
  });

  // Estado para los mensajes de error de validación
  const [errors, setErrors] = useState({});
  // Estado para saber qué campos fueron tocados por el usuario
  const [touched, setTouched] = useState({});
  // Previsualización de imagen
  const [imageError, setImageError] = useState(false);

  // Cargar datos iniciales cuando estamos en modo edición o cambian las props
  useEffect(() => {
    if (productoInicial) {
      setFormData({
        name: productoInicial.name || productoInicial.nombre || "",
        category: productoInicial.category || productoInicial.categoria || "Living",
        price: productoInicial.price !== undefined ? productoInicial.price : (productoInicial.precio || ""),
        description: productoInicial.description || productoInicial.descripcion || "",
        image: productoInicial.image || productoInicial.imageUrl || productoInicial.imagen || "/images/products/sillon-copacabana.png",
        material: productoInicial.material || "",
        measurements: productoInicial.measurements || productoInicial.medidas || "",
        stock: productoInicial.stock !== undefined ? productoInicial.stock : 1,
      });
      setImageError(false);
    }
  }, [productoInicial]);

  // Función de validación de campos
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value || !value.trim()) {
          error = "El nombre del producto es obligatorio.";
        } else if (value.trim().length < 3) {
          error = "El nombre debe tener al menos 3 caracteres.";
        }
        break;

      case "price":
        if (value === "" || value === null || value === undefined) {
          error = "El precio es obligatorio.";
        } else if (isNaN(Number(value)) || Number(value) <= 0) {
          error = "El precio debe ser un número mayor a 0.";
        }
        break;

      case "description":
        if (!value || !value.trim()) {
          error = "La descripción es obligatoria.";
        } else if (value.trim().length < 10) {
          error = "La descripción debe tener al menos 10 caracteres.";
        }
        break;

      case "category":
        if (!value || !value.trim()) {
          error = "Seleccione una categoría válida.";
        }
        break;

      case "image":
        if (!value || !value.trim()) {
          error = "La URL o ruta de la imagen es obligatoria.";
        }
        break;

      case "stock":
        if (value === "" || isNaN(Number(value)) || Number(value) < 0) {
          error = "El stock debe ser un número igual o mayor a 0.";
        }
        break;

      default:
        break;
    }

    return error;
  };

  // Validar todo el formulario antes de enviar
  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const err = validateField(key, formData[key]);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejo de cambios en los inputs
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const finalValue = type === "number" && value !== "" ? Number(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));

    if (name === "image") {
      setImageError(false);
    }

    // Validar en tiempo real si el campo ya fue tocado
    if (touched[name]) {
      const fieldError = validateField(name, finalValue);
      setErrors((prev) => ({
        ...prev,
        [name]: fieldError,
      }));
    }
  };

  // Manejo de desenfoque (blur)
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldError = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: fieldError,
    }));
  };

  // Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Marcar todos los campos como tocados para mostrar errores
    const allTouched = Object.keys(formData).reduce((acc, curr) => {
      acc[curr] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    if (!validateForm()) {
      return;
    }

    // Normalizar objeto para enviar tanto nombres en inglés como en español
    const payload = {
      name: formData.name.trim(),
      nombre: formData.name.trim(),
      category: formData.category,
      categoria: formData.category,
      price: Number(formData.price),
      precio: Number(formData.price),
      description: formData.description.trim(),
      descripcion: formData.description.trim(),
      image: formData.image.trim(),
      imageUrl: formData.image.trim(),
      material: formData.material.trim(),
      measurements: formData.measurements.trim(),
      medidas: formData.measurements.trim(),
      stock: Number(formData.stock) || 0,
    };

    if (onSubmit) {
      await onSubmit(payload);
    }
  };

  // Resetear formulario a su estado original
  const handleReset = () => {
    if (productoInicial) {
      setFormData({
        name: productoInicial.name || productoInicial.nombre || "",
        category: productoInicial.category || productoInicial.categoria || "Living",
        price: productoInicial.price !== undefined ? productoInicial.price : (productoInicial.precio || ""),
        description: productoInicial.description || productoInicial.descripcion || "",
        image: productoInicial.image || productoInicial.imageUrl || productoInicial.imagen || "/images/products/sillon-copacabana.png",
        material: productoInicial.material || "",
        measurements: productoInicial.measurements || productoInicial.medidas || "",
        stock: productoInicial.stock !== undefined ? productoInicial.stock : 1,
      });
    } else {
      setFormData({
        name: "",
        category: "Living",
        price: "",
        description: "",
        image: "/images/products/sillon-copacabana.png",
        material: "",
        measurements: "",
        stock: 1,
      });
    }
    setErrors({});
    setTouched({});
    setImageError(false);
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit} noValidate>
      <div className="admin-form__grid">
        {/* Columna Izquierda: Datos principales */}
        <div className="admin-form__main-col">
          {/* Nombre del producto */}
          <div className="admin-form__field">
            <label htmlFor="field-name" className="admin-form__label">
              Nombre de la pieza <span className="admin-form__required">*</span>
            </label>
            <input
              id="field-name"
              type="text"
              name="name"
              className={`admin-form__input ${
                touched.name && errors.name ? "admin-form__input--error" : ""
              }`}
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Ej: Mesa de Centro Araucaria"
              disabled={cargando}
              required
            />
            {touched.name && errors.name && (
              <span className="admin-form__error-msg">{errors.name}</span>
            )}
          </div>

          {/* Fila: Categoría y Precio */}
          <div className="admin-form__row">
            <div className="admin-form__field">
              <label htmlFor="field-category" className="admin-form__label">
                Categoría <span className="admin-form__required">*</span>
              </label>
              <select
                id="field-category"
                name="category"
                className={`admin-form__select ${
                  touched.category && errors.category ? "admin-form__input--error" : ""
                }`}
                value={formData.category}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={cargando}
              >
                {CATEGORIAS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {touched.category && errors.category && (
                <span className="admin-form__error-msg">{errors.category}</span>
              )}
            </div>

            <div className="admin-form__field">
              <label htmlFor="field-price" className="admin-form__label">
                Precio (ARS) <span className="admin-form__required">*</span>
              </label>
              <input
                id="field-price"
                type="number"
                name="price"
                min="1"
                step="500"
                className={`admin-form__input ${
                  touched.price && errors.price ? "admin-form__input--error" : ""
                }`}
                value={formData.price}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ej: 145000"
                disabled={cargando}
                required
              />
              {touched.price && errors.price && (
                <span className="admin-form__error-msg">{errors.price}</span>
              )}
            </div>
          </div>

          {/* Descripción */}
          <div className="admin-form__field">
            <label htmlFor="field-description" className="admin-form__label">
              Descripción detallada <span className="admin-form__required">*</span>
            </label>
            <textarea
              id="field-description"
              name="description"
              rows={4}
              className={`admin-form__textarea ${
                touched.description && errors.description
                  ? "admin-form__input--error"
                  : ""
              }`}
              value={formData.description}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Describí las cualidades, historia y técnicas de fabricación de la pieza..."
              disabled={cargando}
              required
            />
            {touched.description && errors.description && (
              <span className="admin-form__error-msg">{errors.description}</span>
            )}
          </div>

          {/* Fila: Materiales y Medidas */}
          <div className="admin-form__row">
            <div className="admin-form__field">
              <label htmlFor="field-material" className="admin-form__label">
                Materiales
              </label>
              <input
                id="field-material"
                type="text"
                name="material"
                className="admin-form__input"
                value={formData.material}
                onChange={handleChange}
                placeholder="Ej: Nogal macizo FSC®, latón pulido"
                disabled={cargando}
              />
            </div>

            <div className="admin-form__field">
              <label htmlFor="field-measurements" className="admin-form__label">
                Medidas
              </label>
              <input
                id="field-measurements"
                type="text"
                name="measurements"
                className="admin-form__input"
                value={formData.measurements}
                onChange={handleChange}
                placeholder="Ej: 120 × 60 × 45 cm"
                disabled={cargando}
              />
            </div>
          </div>
        </div>

        {/* Columna Derecha: Imagen, Stock y Previsualización */}
        <div className="admin-form__side-col">
          {/* Stock */}
          <div className="admin-form__field">
            <label htmlFor="field-stock" className="admin-form__label">
              Unidades disponibles (Stock)
            </label>
            <input
              id="field-stock"
              type="number"
              name="stock"
              min="0"
              className={`admin-form__input ${
                touched.stock && errors.stock ? "admin-form__input--error" : ""
              }`}
              value={formData.stock}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={cargando}
            />
            {touched.stock && errors.stock && (
              <span className="admin-form__error-msg">{errors.stock}</span>
            )}
          </div>

          {/* URL de Imagen */}
          <div className="admin-form__field">
            <label htmlFor="field-image" className="admin-form__label">
              URL o Ruta de la imagen <span className="admin-form__required">*</span>
            </label>
            <input
              id="field-image"
              type="text"
              name="image"
              className={`admin-form__input ${
                touched.image && errors.image ? "admin-form__input--error" : ""
              }`}
              value={formData.image}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="/images/products/sillon-copacabana.png"
              disabled={cargando}
              required
            />
            {touched.image && errors.image && (
              <span className="admin-form__error-msg">{errors.image}</span>
            )}

            {/* Atajos de imágenes sugeridas */}
            <div className="admin-form__quick-images">
              <span className="admin-form__quick-images-title">Imágenes de la galería:</span>
              <div className="admin-form__quick-tags">
                {IMAGENES_SUGERIDAS.map((sug) => (
                  <button
                    key={sug.label}
                    type="button"
                    className="admin-form__quick-tag"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, image: sug.url }));
                      setImageError(false);
                      if (touched.image) {
                        setErrors((prev) => ({ ...prev, image: "" }));
                      }
                    }}
                  >
                    {sug.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Caja de previsualización de imagen */}
          <div className="admin-form__preview-box">
            <p className="admin-form__preview-label">Vista previa de imagen:</p>
            <div className="admin-form__preview-wrapper">
              {formData.image && !imageError ? (
                <img
                  src={formData.image}
                  alt="Previsualización de pieza"
                  className="admin-form__preview-img"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="admin-form__preview-placeholder">
                  <span>🖼️</span>
                  <p>{imageError ? "No se pudo cargar la imagen" : "Ingresá una URL de imagen válida"}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pie del formulario con acciones */}
      <div className="admin-form__footer">
        <p className="admin-form__note">
          Los campos con <span className="admin-form__required">*</span> son obligatorios.
        </p>

        <div className="admin-form__actions">
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => navigate(-1)}
            disabled={cargando}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="btn btn--secondary"
            onClick={handleReset}
            disabled={cargando}
          >
            Limpiar
          </button>

          <button
            type="submit"
            className="btn btn--primary"
            disabled={cargando}
          >
            {cargando ? (
              <span>⏳ Guardando...</span>
            ) : isEditing ? (
              "Guardar cambios"
            ) : (
              "Crear producto"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

export default ProductForm;
