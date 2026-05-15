import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="landing-logo">
          <div className="swipe-logo-circle">
            <span className="swipe-logo-s">S</span>
          </div>
          <span className="swipe-text">swipe</span>
          <div className="country-selector">
            🇮🇳 IN <span className="caret">▼</span>
          </div>
        </div>
        
        <ul className="landing-links">
          <li><a href="#">Product</a></li>
          <li><a href="#">Features</a></li>
          <li><a href="#">Pricing</a></li>
          <li><a href="#">Download App</a></li>
          <li><a href="#">Contact</a></li>
        </ul>

        <div className="landing-auth">
          <Link to="/login" className="login-link">Login</Link>
          <Link to="/signup" className="btn btn-primary">Sign up</Link>
        </div>
      </nav>

      <main className="landing-hero">
        <div className="hero-content">
          <div className="safe-badge">100% Safe & Secure!</div>
          <h1 className="hero-title">Simple <span>Accounting</span></h1>
          <p className="hero-subtitle">
            Create <strong>invoices</strong> for free in 10 seconds ⚡<br/>
            Customize templates, share bills on WhatsApp, collect payments!
          </p>
          <Link to="/signup" className="btn btn-primary hero-btn">Sign up for free</Link>
          
          <div className="trusted-by">
            <p className="trusted-text">🤝 Trusted by</p>
            <h3 className="trusted-number">20,00,000+ Businesses</h3>
          </div>
          
          <div className="download-section">
            <p className="download-text">Download for free on</p>
            <div className="store-buttons">
              <button className="store-btn google-play">
                <div className="store-icon">▶</div>
                <div className="store-text">
                  <small>GET IT ON</small>
                  <strong>Google Play</strong>
                </div>
              </button>
              <button className="store-btn app-store">
                <div className="store-icon"></div>
                <div className="store-text">
                  <small>Download on the</small>
                  <strong>App Store</strong>
                </div>
              </button>
            </div>
          </div>
        </div>
        
        <div className="hero-illustration">
          {/* Mocking the complex illustration from the screenshot */}
          <div className="illustration-placeholder">
            <div className="person-left"></div>
            <div className="person-right"></div>
            <div className="floating-elements">
              <div className="float-card tally">Tally</div>
              <div className="float-card payment">Payment Received!</div>
              <div className="float-card shopify">shopify</div>
              <div className="float-card invoice-sent">Invoice Sent!</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
