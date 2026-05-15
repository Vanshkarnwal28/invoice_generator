import React, { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  ShoppingBag, ShoppingCart, FileText, Receipt, Package, 
  Layers, CreditCard, Users, Briefcase, FolderGit2, BarChart2,
  UserPlus, Settings, Gift, ChevronDown
} from 'lucide-react';
import './Sidebar.css';

const SidebarItem = ({ icon: Icon, label, hasSubmenu }) => (
  <div className="nav-item">
    <Icon size={18} />
    <span style={{ flex: 1 }}>{label}</span>
    {hasSubmenu && <ChevronDown size={16} />}
  </div>
);

const Sidebar = () => {
  const [salesOpen, setSalesOpen] = useState(true);
  const { user } = useContext(AuthContext);

  const initials = user?.name ? user.name.substring(0, 2).toUpperCase() : 'AF';
  const workspaceName = user?.businessName || user?.name || 'My Workspace';

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="swipe-logo-circle" style={{ width: 24, height: 24 }}>
            <span className="swipe-logo-s" style={{ fontSize: '1rem' }}>S</span>
          </div>
          <h2>swipe</h2>
        </div>
        <div className="workspace-selector">
          <div className="workspace-avatar">{initials}</div>
          <span className="workspace-name">{workspaceName}</span>
        </div>
      </div>
      <div className="sidebar-scroll">
        <nav className="sidebar-nav">
          <div className="nav-group">
            <div className="nav-item active" onClick={() => setSalesOpen(!salesOpen)}>
              <ShoppingBag size={18} />
              <span style={{ flex: 1, fontWeight: 600 }}>Sales</span>
              <ChevronDown size={16} style={{ transform: salesOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
            </div>
            {salesOpen && (
              <div className="submenu">
                <NavLink to="/sales" className="submenu-item">Invoices</NavLink>
                <div className="submenu-item">Credit Notes</div>
                <div className="submenu-item">E-Invoices</div>
                <div className="submenu-item">Subscriptions</div>
              </div>
            )}
            <SidebarItem icon={ShoppingCart} label="Purchases" hasSubmenu />
            <SidebarItem icon={FileText} label="Quotations+" hasSubmenu />
            <SidebarItem icon={Receipt} label="Expenses+" hasSubmenu />
          </div>

          <div className="nav-group">
            <SidebarItem icon={Package} label="Products & Services" />
            <SidebarItem icon={Layers} label="Inventory" />
          </div>

          <div className="nav-group">
            <SidebarItem icon={CreditCard} label="Payments" hasSubmenu />
            <SidebarItem icon={Users} label="Customers" />
            <SidebarItem icon={Briefcase} label="Vendors" />
            <SidebarItem icon={FolderGit2} label="Projects" />
          </div>

          <div className="nav-group">
            <SidebarItem icon={BarChart2} label="Insights" />
          </div>
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="footer-nav">
          <SidebarItem icon={UserPlus} label="Invite Users" />
          <SidebarItem icon={Settings} label="Settings" />
          <SidebarItem icon={Gift} label="Refer a friend" />
        </div>
        <div className="offer-banner">
          <p><strong>Hurry! Don't miss your<br/>Welcome Offer 🎉</strong></p>
          <button className="btn btn-secondary btn-sm" style={{ marginTop: '0.5rem', width: '100%', borderRadius: '999px', fontSize: '0.75rem' }}>Subscribe Now 🚀</button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
