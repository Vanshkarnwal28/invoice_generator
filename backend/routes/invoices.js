const express = require('express');
const router = express.Router();
const ProFormaInvoice = require('../models/ProFormaInvoice');
const auth = require('../middleware/auth');


// Get all invoices
router.get('/', auth, async (req, res) => {
  try {
    const invoices = await ProFormaInvoice.find({ userId: req.user.id }).populate('customerId').sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new invoice
router.post('/', auth, async (req, res) => {
  try {
    // Generate a simple unique invoice number if not provided
    if (!req.body.invoiceNumber) {
      const count = await ProFormaInvoice.countDocuments();
      req.body.invoiceNumber = `PFI-${String(count + 1).padStart(4, '0')}`;
    }
    const invoice = new ProFormaInvoice({
      ...req.body,
      userId: req.user.id
    });
    const newInvoice = await invoice.save();
    res.status(201).json(newInvoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a single invoice
router.get('/:id', auth, async (req, res) => {
  try {
    const invoice = await ProFormaInvoice.findOne({ _id: req.params.id, userId: req.user.id }).populate('customerId');
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update an invoice
router.put('/:id', auth, async (req, res) => {
  try {
    const updatedInvoice = await ProFormaInvoice.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!updatedInvoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(updatedInvoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an invoice
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedInvoice = await ProFormaInvoice.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deletedInvoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json({ message: 'Invoice deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
