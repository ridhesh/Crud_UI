import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Customers from './pages/Customers';
import Orders from './pages/Orders';
import Dashboard from './pages/Dashboard';
import CreateOrder from './pages/CreateOrder';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-brand">
            <h1>🧺 LaundryPro Manager</h1>
          </div>
          <div className="nav-links">
            <Link 
              to="/" 
              className={activeTab === 'dashboard' ? 'nav-link active' : 'nav-link'}
              onClick={() => setActiveTab('dashboard')}
            >
              📊 Dashboard
            </Link>
            <Link 
              to="/customers" 
              className={activeTab === 'customers' ? 'nav-link active' : 'nav-link'}
              onClick={() => setActiveTab('customers')}
            >
              👥 Customers
            </Link>
            <Link 
              to="/orders" 
              className={activeTab === 'orders' ? 'nav-link active' : 'nav-link'}
              onClick={() => setActiveTab('orders')}
            >
              📦 Orders
            </Link>
            <Link 
              to="/create-order" 
              className={activeTab === 'create-order' ? 'nav-link active' : 'nav-link'}
              onClick={() => setActiveTab('create-order')}
            >
              ➕ New Order
            </Link>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/create-order" element={<CreateOrder />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;