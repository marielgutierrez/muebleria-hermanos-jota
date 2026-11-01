const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio']
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    required: [true, 'El precio es obligatorio']
  },
  stock: {
    type: Number,
    default: 0
  },
  imageUrl: {
    type: String
  }
}, {
  timestamps: true // Agrega fecha de creación y actualización automáticamente
});

module.exports = mongoose.model('Product', productSchema);