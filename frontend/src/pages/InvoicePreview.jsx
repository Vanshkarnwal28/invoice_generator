import React, { useRef, useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import api from '../api';
import { useReactToPrint } from 'react-to-print';
import html2pdf from 'html2pdf.js';
import { 
  ChevronLeft, Printer, Download, Mail, CheckCircle2, 
  Edit3, FileText, Ban, Maximize, ZoomIn, ZoomOut, RotateCcw
} from 'lucide-react';
import './InvoicePreview.css';

const InvoicePreview = () => {
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const autoPrint = queryParams.get('autoprint');

  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const documentRef = useRef();

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await api.get(`/invoices/${id}`);
        setInvoice(response.data);
      } catch (error) {
        console.warn('Backend unavailable, using mock data for print preview.');
        setInvoice({
          _id: '1',
          invoiceNumber: 'INV-1',
          date: new Date().toISOString(),
          customer: { name: 'Default Customer', address: '123 Test St', email: 'test@example.com' },
          items: [{ name: 'Sample Product', hsn: '00000000', quantity: 2, price: 99.00, taxRate: 18 }],
          totalAmount: 198.00,
          cgstTotal: 17.82,
          sgstTotal: 17.82,
          grandTotal: 233.64
        });
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id]);

  const handlePrint = useReactToPrint({
    contentRef: documentRef,
    documentTitle: `Invoice_${invoice?.invoiceNumber || 'Unknown'}`,
  });

  useEffect(() => {
    if (!loading && invoice && autoPrint === 'true') {
      const timer = setTimeout(() => {
        handlePrint();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading, invoice, autoPrint, handlePrint]);

  const handleDownloadPDF = () => {
    const element = documentRef.current;
    const opt = {
      margin: 10,
      filename: `Invoice_${invoice?.invoiceNumber || 'Unknown'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const handleEmailSend = () => {
    const subject = encodeURIComponent(`Invoice ${invoice?.invoiceNumber || ''} from afc`);
    const body = encodeURIComponent(`Hello ${invoice?.customer?.name || 'Customer'},\n\nPlease find attached the invoice ${invoice?.invoiceNumber || ''} for your recent purchase.\n\nThank you for your business!`);
    window.location.href = `mailto:${invoice?.customer?.email || ''}?subject=${subject}&body=${body}`;
  };

  const handleWhatsappSend = () => {
    const waText = encodeURIComponent(`Hello ${invoice?.customer?.name || 'Customer'},\n\nHere is your invoice ${invoice?.invoiceNumber || ''}. Please let me know if you have any questions!`);
    window.open(`https://wa.me/?text=${waText}`, '_blank');
  };

  if (loading) return <div className="loading-state">Loading Invoice Preview...</div>;
  if (!invoice) return <div className="error-state">Invoice not found!</div>;

  return (
    <div className="preview-container">
      {/* Top Bar Checkboxes */}
      <div className="preview-topbar">
        <label><input type="checkbox" defaultChecked /> Customer</label>
        <label><input type="checkbox" /> Transport</label>
        <label><input type="checkbox" /> Supplier</label>
        <label><input type="checkbox" /> Delivery Challan</label>
      </div>

      <div className="preview-layout">
        {/* Left Sidebar - Templates */}
        <div className="template-sidebar">
          <Link to="/sales" className="back-link"><ChevronLeft size={16} /> Select your favourite template!</Link>
          <div className="template-list">
            <div className={`template-item ${selectedTemplate === 'modern' ? 'active' : ''}`} onClick={() => setSelectedTemplate('modern')}>
              <div className="template-thumb modern-thumb"></div>
              <span>Modern {selectedTemplate === 'modern' && <CheckCircle2 size={14} className="active-icon" color="#10b981" />}</span>
            </div>
            <div className={`template-item ${selectedTemplate === 'vintage' ? 'active' : ''}`} onClick={() => setSelectedTemplate('vintage')}>
              <div className="template-thumb vintage-thumb"></div>
              <span>Vintage {selectedTemplate === 'vintage' && <CheckCircle2 size={14} className="active-icon" color="#10b981" />}</span>
            </div>
            <div className={`template-item ${selectedTemplate === 'dmart' ? 'active' : ''}`} onClick={() => setSelectedTemplate('dmart')}>
              <div className="template-thumb dmart-thumb"></div>
              <span>DMart {selectedTemplate === 'dmart' && <CheckCircle2 size={14} className="active-icon" color="#10b981" />}</span>
            </div>
          </div>
        </div>

        {/* Center - Document Viewer */}
        <div className="document-center">
          <div className="doc-toolbar">
            <div className="doc-info">7e91c...</div>
            <div className="doc-pagination">1 / 1</div>
            <div className="doc-zoom">
              <button className="tool-btn"><ZoomOut size={16}/></button>
              <span>91%</span>
              <button className="tool-btn"><ZoomIn size={16}/></button>
            </div>
            <div className="doc-actions">
              <button className="tool-btn"><Maximize size={16}/></button>
              <button className="tool-btn"><RotateCcw size={16}/></button>
              <div className="divider"></div>
              <button className="tool-btn" onClick={handleDownloadPDF}><Download size={16}/></button>
              <button className="tool-btn" onClick={handlePrint}><Printer size={16}/></button>
            </div>
          </div>
          
          <div className="document-wrapper">
            {/* The Actual A4 Document that gets printed */}
            <div className={`a4-document template-${selectedTemplate}`} ref={documentRef}>
              <div className="doc-header">
                <h2>TAX INVOICE</h2>
                <div className="doc-recipient-badge">ORIGINAL FOR RECIPIENT</div>
              </div>
              <div className="doc-meta">
                <div className="company-details">
                  <h3>afc</h3>
                  <div className="customer-info">
                    <strong>Customer Details:</strong><br/>
                    {invoice.customer?.name}<br/>
                    {invoice.customer?.address || ''}
                  </div>
                </div>
                <div className="invoice-details">
                  <div className="detail-row">
                    <span>Invoice #:</span>
                    <strong>{invoice.invoiceNumber}</strong>
                  </div>
                  <div className="detail-row">
                    <span>Invoice Date:</span>
                    <strong>{invoice.date ? new Date(invoice.date).toLocaleDateString() : ''}</strong>
                  </div>
                  <div className="detail-row" style={{marginTop: '1rem'}}>
                    <span>Due Date:</span>
                    <strong>{invoice.date ? new Date(invoice.date).toLocaleDateString() : ''}</strong>
                  </div>
                </div>
              </div>

              <table className="doc-items-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Item</th>
                    <th>HSN/SAC</th>
                    <th style={{textAlign: 'right'}}>Rate/Item</th>
                    <th style={{textAlign: 'right'}}>Qty</th>
                    <th style={{textAlign: 'right'}}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items?.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <strong>{item.name}</strong>
                        {item.description && <div className="item-desc">{item.description}</div>}
                      </td>
                      <td>{item.hsn || '00000000'}</td>
                      <td style={{textAlign: 'right'}}>{(item.unitPrice || 0).toFixed(2)}<br/><span className="tax-rate-sub">{(item.unitPrice || 0).toFixed(2)} (-{item.discount || 0}%)</span></td>
                      <td style={{textAlign: 'right'}}>{item.quantity}</td>
                      <td style={{textAlign: 'right'}}>{((item.unitPrice || 0) * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="watermark">swipe</div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Actions */}
        <div className="actions-sidebar">
          <div className="congrats-card">
            <h3>You have created your first invoice! 🎉</h3>
            <p>Great Start! Add missing details to make this invoice look professional.</p>
            
            <div className="add-details-grid">
              <button className="detail-btn">+ Add Logo</button>
              <button className="detail-btn">+ Add Signature</button>
              <button className="detail-btn">+ Add Bank Details</button>
              <button className="detail-btn">+ Add Company Address</button>
            </div>
            
            <button className="ai-btn">✨ Ask SwipeAI, how to customize your document?</button>
          </div>

          <div className="action-section">
            <label>Send Via</label>
            <div className="send-buttons">
              <button className="send-btn email" onClick={handleEmailSend}><Mail size={16}/> Email</button>
              <button className="send-btn whatsapp" onClick={handleWhatsappSend}><img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" width="16" alt="wa"/> Whatsapp</button>
            </div>
          </div>

          <div className="action-section">
            <label>Actions</label>
            <div className="action-list">
              <Link to={`/sales/edit/${invoice._id}`} className="list-btn"><Edit3 size={16}/> Edit</Link>
              <button className="list-btn" onClick={handleDownloadPDF}><Download size={16}/> Download PDF</button>
              <button className="list-btn"><Printer size={16}/> Thermal Print</button>
              <button className="list-btn danger"><Ban size={16}/> Cancel Invoice</button>
            </div>
          </div>

          <button className="print-main-btn" onClick={handlePrint}><Printer size={18}/> Print Invoice</button>
          <Link to="/sales" className="go-sales-link">Go to Sales →</Link>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
