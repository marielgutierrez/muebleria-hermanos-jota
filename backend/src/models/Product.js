const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      index: true,
    },
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },
    category: {
      type: String,
      default: "Living",
      trim: true,
    },
    material: {
      type: String,
      default: "",
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "El precio es obligatorio"],
      min: [0, "El precio no puede ser negativo"],
    },
    measurements: {
      type: String,
      default: "",
      trim: true,
    },
    imageUrl: {
      type: String,
      default: "/images/products/sillon-copacabana.png",
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "El stock no puede ser negativo"],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        // Alias en español y campos alternativos para máxima compatibilidad con el frontend
        ret.nombre = ret.name;
        ret.precio = ret.price;
        ret.categoria = ret.category;
        ret.descripcion = ret.description;
        ret.medidas = ret.measurements;
        ret.image = ret.imageUrl;
        ret.imagenUrl = ret.imageUrl;
        if (ret.id === undefined && ret._id) {
          ret.id = ret._id.toString();
        }
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.nombre = ret.name;
        ret.precio = ret.price;
        ret.categoria = ret.category;
        ret.descripcion = ret.description;
        ret.medidas = ret.measurements;
        ret.image = ret.imageUrl;
        ret.imagenUrl = ret.imageUrl;
        if (ret.id === undefined && ret._id) {
          ret.id = ret._id.toString();
        }
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("Product", productSchema);
