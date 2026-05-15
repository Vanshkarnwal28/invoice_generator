const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  taxRate: { type: Number, default: 18 }, // Default GST percentage
  unit: { type: String, default: 'pcs' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
