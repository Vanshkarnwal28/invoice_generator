import React, { useContext, useState } from 'react';
import { Search, Megaphone, Bell, User, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-search">
        <Search className="search-icon" size={16} />
        <input type="text" placeholder="How to edit terms and conditions on my invoice?" />
        <span className="shortcut">ctrl+k</span>
      </div>
      <div className="navbar-actions">
        <button className="icon-btn"><Megaphone size={18} /></button>
        <button className="icon-btn"><Bell size={18} /></button>
        
        <div className="profile-wrapper" style={{ position: 'relative' }}>
          <button 
            className="icon-btn profile-btn" 
            onClick={() => setShowDropdown(!showDropdown)}
            title={user?.name || 'Profile'}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : <User size={18} />}
          </button>
          
          {showDropdown && (
            <div className="profile-dropdown" style={{
              position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem',
              background: 'white', border: '1px solid #e5e7eb', borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', minWidth: '150px', zIndex: 100
            }}>
              <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{user?.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{user?.email}</div>
              </div>
              <button 
                onClick={logout}
                style={{ width: '100%', textAlign: 'left', padding: '0.75rem 1rem', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
