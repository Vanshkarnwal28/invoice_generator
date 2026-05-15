import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Sales from './pages/Sales';
import CreateInvoice from './pages/CreateInvoice';
import InvoicePreview from './pages/InvoicePreview';

// Layout wrapper for dashboard pages
const DashboardLayout = ({ children }) => (
  <div className="app-container">
    <Sidebar />
    <div className="main-content">
      <Navbar />
      <div className="page-content">
        {children}
      </div>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route path="/sales" element={<ProtectedRoute><DashboardLayout><Sales /></DashboardLayout></ProtectedRoute>} />
          <Route path="/sales/new" element={<ProtectedRoute><DashboardLayout><CreateInvoice /></DashboardLayout></ProtectedRoute>} />
          <Route path="/sales/edit/:id" element={<ProtectedRoute><DashboardLayout><CreateInvoice /></DashboardLayout></ProtectedRoute>} />
          <Route path="/print/invoice/:id" element={<ProtectedRoute><InvoicePreview /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
