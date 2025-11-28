import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerAPI, orderAPI } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    avgOrderValue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      setError('');
      
      const [customersRes, ordersRes] = await Promise.all([
        customerAPI.getAllCustomers(),
        orderAPI.getAllOrders()
      ]);

      const customers = customersRes.data.customers || [];
      const orders = ordersRes.data.orders || [];

      const totalRevenue = orders.reduce((sum, order) => {
        const amount = parseFloat(order.total_amount) || 0;
        return sum + amount;
      }, 0);

      const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

      // Count orders by status
      const pendingOrders = orders.filter(order => 
        order.status === 'Received' || order.status === 'In Progress'
      ).length;

      const completedOrders = orders.filter(order => 
        order.status === 'Completed' || order.status === 'Delivered'
      ).length;

      const newStats = {
        totalCustomers: customers.length,
        totalOrders: orders.length,
        pendingOrders,
        completedOrders,
        totalRevenue,
        avgOrderValue
      };

      setStats(newStats);
      setRecentOrders(orders.slice(0, 5));
      setLastUpdate(new Date());
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const handleQuickAction = (action) => {
    switch(action) {
      case 'add-customer':
        navigate('/customers');
        break;
      case 'create-order':
        navigate('/create-order');
        break;
      case 'view-orders':
        navigate('/orders');
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="loading">
          <div className="loading-spinner"></div>
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="card-header">
        <h1 className="card-title">📊 Dashboard Overview</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '0.875rem', color: '#666' }}>
            Last update: {lastUpdate.toLocaleTimeString()}
          </div>
          <button 
            onClick={fetchDashboardData}
            className="btn btn-outline"
            disabled={loading}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          ❌ {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-value">{stats.totalCustomers}</div>
          <div className="stat-label">Total Customers</div>
          <div className="stat-change positive">📈 Active</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-value">{stats.totalOrders}</div>
          <div className="stat-label">Total Orders</div>
          <div className="stat-change positive">📈 All Time</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-value">{stats.pendingOrders}</div>
          <div className="stat-label">Pending Orders</div>
          <div className="stat-change negative">📊 In Progress</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{stats.completedOrders}</div>
          <div className="stat-label">Completed Orders</div>
          <div className="stat-change positive">📊 Delivered</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-value">{formatCurrency(stats.totalRevenue)}</div>
          <div className="stat-label">Total Revenue</div>
          <div className="stat-change positive">📈 Total Earnings</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-value">{formatCurrency(stats.avgOrderValue)}</div>
          <div className="stat-label">Avg Order Value</div>
          <div className="stat-change positive">📈 Per Order</div>
        </div>
      </div>

      {/* Recent Orders & Quick Actions */}
      <div className="grid grid-2">
        <div className="card">
          <h2 className="card-title">📋 Recent Orders</h2>
          {recentOrders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📦</div>
              <h3>No orders yet</h3>
              <p>Start by creating your first order</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Status</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.customer_name}</td>
                      <td>{order.service_name}</td>
                      <td>
                        <span className={`status-badge status-${order.status.toLowerCase().replace(' ', '-')}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>{formatCurrency(order.total_amount || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="card-title">⚡ Quick Actions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button 
              className="btn btn-primary"
              onClick={() => handleQuickAction('add-customer')}
            >
              ➕ Add New Customer
            </button>
            <button 
              className="btn btn-success"
              onClick={() => handleQuickAction('create-order')}
            >
              📦 Create New Order
            </button>
            <button 
              className="btn btn-info"
              onClick={() => handleQuickAction('view-orders')}
            >
              📋 View All Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;