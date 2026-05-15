import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Play, Settings, Search, Filter, Eye, Send, MoreHorizontal, IndianRupee, BellRing } from 'lucide-react';
import { format } from 'date-fns';
import './Sales.css';

const Sales = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      // Assuming backend is running, if not, we fallback to mock data
      const response = await api.get('/invoices');
      setInvoices(response.data);
    } catch (error) {
      console.warn('Backend unavailable, using mock data for Sales dashboard.');
      setInvoices([
        {
          _id: '1',
          invoiceNumber: 'INV-1',
          customerId: { name: 'Default Customer' },
          date: new Date().toISOString(),
          totalAmount: 198.00,
          status: 'pending',
          mode: ''
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const tabs = ['All', 'Pending', 'Paid', 'Cancelled', 'Drafts'];

  const filteredInvoices = invoices.filter(inv => {
    if (activeTab === 'All') return true;
    return inv.status?.toLowerCase() === activeTab.toLowerCase();
  });

  const totalAmount = invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
  const totalPending = invoices.filter(i => i.status === 'pending').reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);

  return (
    <div className="sales-dashboard">
      <div className="welcome-banner">
        Welcome Offer 🎉 ₹500 OFF on premium plans! - Only 6 days left! <button className="btn-subscribe">Subscribe Now 🚀</button>
      </div>

      <div className="sales-header">
        <div className="title-section">
          <h1 className="h1">Sales</h1>
          <Play className="play-icon" size={16} />
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary"><Settings size={14} /> Document Settings</button>
          <button className="btn btn-purple">POS Billing</button>
          <Link to="/sales/new" className="btn btn-primary">+ Create Invoice</Link>
        </div>
      </div>

      <div className="tabs-container">
        {tabs.map(tab => (
          <div 
            key={tab} 
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab} {tab === 'All' && <span className="tab-count">{invoices.length}</span>}
          </div>
        ))}
      </div>

      <div className="filters-bar">
        <div className="search-wrapper">
          <Search size={16} className="text-muted" />
          <input type="text" placeholder="Search by transaction, customers, invoice etc.." />
        </div>
        <select className="date-select">
          <option>This Year</option>
        </select>
        <div className="filters-right">
          <button className="btn btn-secondary">Actions ▼</button>
          <button className="btn btn-icon"><Filter size={18} /></button>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Amount ▼</th>
              <th>Status ▼</th>
              <th>Mode ▼</th>
              <th>Bill # ▼</th>
              <th>Customer</th>
              <th>Date<br/><span style={{fontSize: '0.65rem', fontWeight: 'normal'}}>Created time</span></th>
              <th style={{textAlign: 'right'}}></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{textAlign: 'center'}}>Loading...</td></tr>
            ) : filteredInvoices.length === 0 ? (
              <tr><td colSpan="7" style={{textAlign: 'center'}}>No invoices found</td></tr>
            ) : (
              filteredInvoices.map(invoice => (
                <tr key={invoice._id}>
                  <td style={{fontWeight: 600}}>₹ {invoice.totalAmount?.toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${invoice.status || 'pending'}`}>
                      {invoice.status || 'pending'}
                    </span>
                    {(invoice.status === 'pending' || !invoice.status) && <BellRing size={12} className="alert-icon" style={{marginLeft: 4, color: '#f59e0b'}} />}
                  </td>
                  <td className="text-muted">{invoice.mode || '-'}</td>
                  <td>{invoice.invoiceNumber}</td>
                  <td>{invoice.customerId?.name || 'Unknown'}</td>
                  <td>
                    <div>{format(new Date(invoice.date), 'dd MMM yyyy')}</div>
                    <div className="text-muted" style={{fontSize: '0.75rem'}}>a minute ago</div>
                  </td>
                  <td style={{textAlign: 'right'}}>
                    <div className="action-buttons">
                      <button className="action-btn rupee-btn"><IndianRupee size={12} /></button>
                      <Link to={`/print/invoice/${invoice._id}`} className="action-btn view-btn"><Eye size={12} /> View</Link>
                      <button className="action-btn send-btn"><Send size={12} /> Send</button>
                      <button className="action-btn more-btn"><MoreHorizontal size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="summary-footer">
        <div className="summary-stats">
          <span className="stat-pill total">Total ₹ {totalAmount.toFixed(2)}</span>
          <span className="stat-pill paid">Paid ₹ {totalPaid.toFixed(2)}</span>
          <span className="stat-pill pending">Pending ₹ {totalPending.toFixed(2)}</span>
        </div>
        <div className="pagination">
          <span>1/1</span>
          <button className="page-btn">{'<'}</button>
          <button className="page-btn">{'>'}</button>
        </div>
      </div>

      <div className="footer-promos">
        <div className="promo-card">
          <h4>Bulk Upload Invoices</h4>
          <p>Upload invoices at once from Excel or CSV files.</p>
          <button className="btn-outline">Talk to Specialist →</button>
        </div>
        <div className="promo-card">
          <h4>Tally Integration</h4>
          <p>Automatically sync your Swipe data with Tally.</p>
          <button className="btn-outline">Talk to Specialist →</button>
        </div>
        <div className="promo-card">
          <h4>E-Way Bills</h4>
          <p>Generate and manage e-way bills effortlessly.</p>
          <button className="btn-outline">Talk to Specialist →</button>
        </div>
      </div>
      
      <div className="whatsapp-float">
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" width="30" height="30" />
      </div>
    </div>
  );
};

export default Sales;
