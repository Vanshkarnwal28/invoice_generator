import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/sales');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-creative">
        <div className="badge-safe">100% Safe & Secure!</div>
        <h1 className="creative-title">Simple<br/>Accounting</h1>
        <p className="creative-subtitle">
          Create <strong>invoices</strong> for free in 10 seconds ⚡<br/>
          Customize templates, share bills on WhatsApp, collect payments!
        </p>
        
        <div className="floating-elements">
          <div className="float-bubble bubble-1">Invoice Sent!</div>
          <div className="float-bubble bubble-2">Tally</div>
          <div className="float-bubble bubble-3">shopify</div>
          <div className="float-bubble bubble-4">Payment Received!</div>
        </div>

        <div className="trusted-by">
          <span className="handshake" style={{ fontSize: '1.2rem', marginRight: '0.25rem' }}>🤝</span> Trusted by<br/>
          <strong>20,00,000+ Businesses</strong>
        </div>
      </div>

      <div className="auth-form-wrapper">
        <div className="auth-card">
        <div className="auth-header">
          <div className="swipe-logo-circle" style={{ width: 40, height: 40, margin: '0 auto 1rem auto' }}>
            <span className="swipe-logo-s" style={{ fontSize: '1.5rem' }}>S</span>
          </div>
          <h2>Welcome Back</h2>
          <p>Login to your Swipe account</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className="form-control" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary auth-btn">Login</button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/signup">Sign up for free</Link>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Login;
