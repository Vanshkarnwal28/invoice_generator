const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: { type: String, required: true },
  description: { type: String },
  quantity: { type: Number, required: true, default: 1 },
  unitPrice: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  taxRate: { type: Number, default: 18 }, // Percentage
  total: { type: Number, required: true } // after discount before tax (or inclusive of tax, depends on calculation)
});

const proFormaInvoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  date: { type: Date, default: Date.now },
  dueDate: { type: Date },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [invoiceItemSchema],
  subtotal: { type: Number, required: true, default: 0 },
  totalDiscount: { type: Number, default: 0 },
  cgst: { type: Number, default: 0 },
  sgst: { type: Number, default: 0 },
  igst: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  notes: { type: String },
  termsAndConditions: { type: String },
  status: { type: String, enum: ['drafts', 'pending', 'paid', 'cancelled', 'Draft', 'Sent', 'Converted'], default: 'pending' },
  mode: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('ProFormaInvoice', proFormaInvoiceSchema);
