const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "El producto es obligatorio"],
    },
    name: {
      type: String,
      required: [true, "El nombre del producto es obligatorio"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "El precio unitario es obligatorio"],
      min: [0, "El precio unitario no puede ser negativo"],
    },
    quantity: {
      type: Number,
      required: [true, "La cantidad es obligatoria"],
      min: [1, "La cantidad mínima debe ser al menos 1"],
      default: 1,
    },
    imageUrl: {
      type: String,
      default: "/images/products/sillon-copacabana.png",
      trim: true,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El pedido debe estar asociado a un usuario"],
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: "El pedido debe contener al menos un producto.",
      },
    },
    total: {
      type: Number,
      required: [true, "El importe total es obligatorio"],
      min: [0, "El total no puede ser negativo"],
    },
    status: {
      type: String,
      enum: ["pendiente", "confirmado", "en preparacion", "enviado", "entregado", "cancelado"],
      default: "confirmado",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        if (!ret.id && ret._id) {
          ret.id = ret._id.toString();
        }
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Order", orderSchema);
