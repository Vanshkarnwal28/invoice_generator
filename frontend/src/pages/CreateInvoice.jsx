import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import api from '../api';
import './CreateInvoice.css';

const CreateInvoice = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  
  // Invoice State
  const [invoice, setInvoice] = useState({
    customerId: '',
    invoiceNumber: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    items: [
      { name: '', description: '', quantity: 1, unitPrice: 0, discount: 0, taxRate: 18, total: 0 }
    ],
    notes: '',
    termsAndConditions: 'Thanks for doing business with us!',
    status: 'Draft'
  });

  useEffect(() => {
    fetchCustomers();
    if (isEdit) {
      fetchInvoiceDetails();
    }
  }, [id]);

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customers');
      if (res.data && res.data.length > 0) {
        setCustomers(res.data);
      } else {
        setCustomers([{ _id: '000000000000000000000000', name: 'John Doe (Demo)' }]);
      }
    } catch (err) {
      console.error(err);
      // fallback for demo without db
      setCustomers([{ _id: '000000000000000000000000', name: 'John Doe (Demo)' }]);
    }
  };

  const fetchInvoiceDetails = async () => {
    try {
      const res = await api.get(`/invoices/${id}`);
      const data = res.data;
      data.date = data.date.split('T')[0];
      if (data.dueDate) data.dueDate = data.dueDate.split('T')[0];
      setInvoice(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoice(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...invoice.items];
    newItems[index][field] = value;
    
    // Recalculate row total
    const item = newItems[index];
    const qty = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.unitPrice) || 0;
    const disc = parseFloat(item.discount) || 0;
    const basePrice = qty * price;
    const discountAmount = (basePrice * disc) / 100;
    item.total = basePrice - discountAmount;
    
    setInvoice(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, { name: '', description: '', quantity: 1, unitPrice: 0, discount: 0, taxRate: 18, total: 0 }]
    }));
  };

  const removeItem = (index) => {
    if (invoice.items.length === 1) return;
    const newItems = [...invoice.items];
    newItems.splice(index, 1);
    setInvoice(prev => ({ ...prev, items: newItems }));
  };

  // Calculate Totals
  const subtotal = invoice.items.reduce((sum, item) => sum + item.total, 0);
  
  // Calculate GST based on tax rates of individual items
  let totalCGST = 0;
  let totalSGST = 0;
  let totalIGST = 0; // Assuming intra-state for simplicity, or we can use IGST
  
  invoice.items.forEach(item => {
    const taxAmount = (item.total * item.taxRate) / 100;
    // Assuming 9% CGST and 9% SGST for an 18% rate
    totalCGST += taxAmount / 2;
    totalSGST += taxAmount / 2;
  });

  const totalAmount = subtotal + totalCGST + totalSGST;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Check if customer is empty and handle gracefully
    let finalCustomerId = invoice.customerId;
    if (!finalCustomerId && customers.length > 0) {
        finalCustomerId = customers[0]._id; // Default to first for demo
    }

    const payload = {
      ...invoice,
      customerId: finalCustomerId,
      subtotal,
      cgst: totalCGST,
      sgst: totalSGST,
      totalAmount
    };

    try {
      let savedInvoiceId = id;
      if (isEdit) {
        await api.put(`/invoices/${id}`, payload);
      } else {
        const res = await api.post('/invoices', payload);
        savedInvoiceId = res.data._id;
      }
      navigate(`/print/invoice/${savedInvoiceId}?autoprint=true`);
    } catch (err) {
      console.error(err);
      alert('Error saving invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-invoice">
      <div className="header-actions">
        <Link to="/pro-forma-invoices" className="btn btn-secondary" style={{ border: 'none', background: 'transparent' }}>
          <ArrowLeft size={18} /> Back
        </Link>
        <h1 className="h2">{isEdit ? 'Edit Pro Forma Invoice' : 'New Pro Forma Invoice'}</h1>
        <div style={{flex: 1}}></div>
        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
          <Save size={18} /> {loading ? 'Saving...' : 'Save & Continue'}
        </button>
      </div>

      <div className="card invoice-form">
        <div className="form-row">
          <div className="form-group" style={{ flex: 2 }}>
            <label className="form-label">Customer</label>
            <select className="form-control" name="customerId" value={invoice.customerId} onChange={handleInputChange} required>
              <option value="">Select a Customer</option>
              {customers.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
            {customers.length === 0 && <small className="text-muted">No customers found. Using demo mode.</small>}
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Invoice Number</label>
            <input type="text" className="form-control" name="invoiceNumber" value={invoice.invoiceNumber} onChange={handleInputChange} placeholder="Leave blank to auto-generate" />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Invoice Date</label>
            <input type="date" className="form-control" name="date" value={invoice.date} onChange={handleInputChange} required />
          </div>
        </div>

        <div className="items-table-container">
          <table className="table items-table">
            <thead>
              <tr>
                <th width="40%">Item Name</th>
                <th width="10%">Qty</th>
                <th width="15%">Unit Price</th>
                <th width="10%">Discount (%)</th>
                <th width="10%">GST (%)</th>
                <th width="10%">Amount</th>
                <th width="5%"></th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, idx) => (
                <tr key={idx}>
                  <td>
                    <input type="text" className="form-control" placeholder="Item Name" value={item.name} onChange={(e) => handleItemChange(idx, 'name', e.target.value)} required />
                    <input type="text" className="form-control" placeholder="Description (Optional)" value={item.description} onChange={(e) => handleItemChange(idx, 'description', e.target.value)} style={{ marginTop: '0.5rem', fontSize: '0.8rem' }} />
                  </td>
                  <td>
                    <input type="number" className="form-control" min="1" value={item.quantity} onChange={(e) => handleItemChange(idx, 'quantity', parseFloat(e.target.value))} required />
                  </td>
                  <td>
                    <input type="number" className="form-control" min="0" value={item.unitPrice} onChange={(e) => handleItemChange(idx, 'unitPrice', parseFloat(e.target.value))} required />
                  </td>
                  <td>
                    <input type="number" className="form-control" min="0" max="100" value={item.discount} onChange={(e) => handleItemChange(idx, 'discount', parseFloat(e.target.value))} />
                  </td>
                  <td>
                    <select className="form-control" value={item.taxRate} onChange={(e) => handleItemChange(idx, 'taxRate', parseFloat(e.target.value))}>
                      <option value="0">0%</option>
                      <option value="5">5%</option>
                      <option value="12">12%</option>
                      <option value="18">18%</option>
                      <option value="28">28%</option>
                    </select>
                  </td>
                  <td style={{ fontWeight: 600 }}>₹{item.total.toFixed(2)}</td>
                  <td>
                    <button type="button" className="icon-btn" style={{ color: 'var(--danger)' }} onClick={() => removeItem(idx)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <button type="button" className="btn btn-secondary mt-3" onClick={addItem} style={{ marginTop: '1rem' }}>
            <Plus size={16} /> Add Item
          </button>
        </div>

        <div className="invoice-footer">
          <div className="notes-section">
            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea className="form-control" rows="3" name="notes" value={invoice.notes} onChange={handleInputChange}></textarea>
            </div>
            <div className="form-group">
              <label className="form-label">Terms and Conditions</label>
              <textarea className="form-control" rows="3" name="termsAndConditions" value={invoice.termsAndConditions} onChange={handleInputChange}></textarea>
            </div>
          </div>
          
          <div className="summary-section">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row text-muted">
              <span>CGST:</span>
              <span>₹{totalCGST.toFixed(2)}</span>
            </div>
            <div className="summary-row text-muted">
              <span>SGST:</span>
              <span>₹{totalSGST.toFixed(2)}</span>
            </div>
            <hr style={{ margin: '1rem 0', borderColor: 'var(--border-color)' }} />
            <div className="summary-row total-row">
              <span>Total Amount:</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;
