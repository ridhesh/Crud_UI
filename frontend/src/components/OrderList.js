import React, { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchOrders = async () => {
    try {
      console.log('🔄 Fetching orders...');
      const response = await orderAPI.getAllOrders();
      
      // BULLETPROOF: Ensure ALL orders have safe values
      const safeOrders = (response.data.orders || []).map(order => ({
        id: order.id || 0,
        customer_id: order.customer_id || 0,
        service_name: order.service_name || 'Unknown Service',
        quantity: order.quantity || 0,
        total_amount: order.total_amount || '0.00',
        status: order.status || 'Received',
        priority: order.priority || 'Medium',
        customer_name: order.customer_name || 'Unknown Customer',
        customer_phone: order.customer_phone || 'N/A',
        created_date: order.created_date || new Date().toISOString()
      }));
      
      console.log('✅ Safe orders:', safeOrders);
      setOrders(safeOrders);
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingStatus(orderId);
    try {
      await orderAPI.updateOrderStatus(orderId, newStatus);
      console.log(`✅ Order ${orderId} status updated to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      console.error('❌ Error updating order status:', error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDeleteOrder = async (orderId, serviceName) => {
    if (!window.confirm(`Are you sure you want to delete order: ${serviceName}?`)) {
      return;
    }

    setDeletingId(orderId);
    try {
      await orderAPI.deleteOrder(orderId);
      setOrders(orders.filter(order => order.id !== orderId));
      console.log(`✅ Order ${serviceName} deleted successfully`);
    } catch (err) {
      console.error('❌ Error deleting order:', err);
      alert(err.response?.data?.error || 'Failed to delete order');
    } finally {
      setDeletingId(null);
    }
  };

  // BULLETPROOF: Completely safe priority class function
  const getPriorityClass = (priority) => {
    if (priority === null || priority === undefined || priority === '') {
      return 'priority-medium';
    }
    
    const priorityStr = String(priority).toLowerCase().trim();
    
    const priorityClass = {
      'low': 'priority-low',
      'medium': 'priority-medium', 
      'high': 'priority-high'
    };
    
    return priorityClass[priorityStr] || 'priority-medium';
  };

  // BULLETPROOF: Completely safe status class function
  const getStatusClass = (status) => {
    if (status === null || status === undefined || status === '') {
      return 'status-received';
    }
    
    const statusStr = String(status).toLowerCase().trim();
    
    const statusClass = {
      'received': 'status-received',
      'in progress': 'status-in-progress',
      'completed': 'status-completed',
      'delivered': 'status-delivered'
    };
    
    return statusClass[statusStr] || 'status-received';
  };

  // BULLETPROOF: Safe display function
  const safeDisplay = (value, defaultValue = 'N/A') => {
    if (value === null || value === undefined || value === '') {
      return defaultValue;
    }
    return value;
  };

  if (loading) {
    return (
      <div className="card">
        <div className="loading">
          <div className="loading-spinner"></div>
          Loading orders...
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">📦 Order List</h2>
        <button 
          onClick={fetchOrders}
          className="btn btn-outline"
          disabled={loading}
        >
          🔄 Refresh
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <h3>No orders found</h3>
          <p>Create your first order to get started</p>
        </div>
      ) : (
        <div className="table-container responsive-table">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Order ID</th>
                <th style={{ width: '150px' }}>Customer</th>
                <th style={{ width: '120px' }}>Service</th>
                <th style={{ width: '80px' }}>Qty</th>
                <th style={{ width: '100px' }}>Amount</th>
                <th style={{ width: '120px' }}>Status</th>
                <th style={{ width: '100px' }}>Priority</th>
                <th style={{ width: '120px' }}>Created</th>
                <th style={{ width: '200px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 'bold' }}>#{safeDisplay(order.id)}</td>
                  <td>
                    <div>
                      <strong>{safeDisplay(order.customer_name)}</strong>
                      <br />
                      <small style={{ color: 'var(--gray-600)' }}>
                        {safeDisplay(order.customer_phone)}
                      </small>
                    </div>
                  </td>
                  <td>{safeDisplay(order.service_name)}</td>
                  <td style={{ textAlign: 'center' }}>{safeDisplay(order.quantity)}</td>
                  <td style={{ fontWeight: 'bold', color: 'var(--success)' }}>
                    ₹{safeDisplay(order.total_amount, '0.00')}
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusClass(order.status)}`}>
                      {safeDisplay(order.status, 'Received')}
                    </span>
                  </td>
                  <td>
                    <span className={`priority-badge ${getPriorityClass(order.priority)}`}>
                      {safeDisplay(order.priority, 'Medium')}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                    {order.created_date ? new Date(order.created_date).toLocaleDateString('en-IN') : 'N/A'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <select
                          value={safeDisplay(order.status, 'Received')}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="form-select"
                          style={{ 
                            padding: '0.25rem', 
                            fontSize: '0.8rem',
                            flex: 1
                          }}
                          disabled={updatingStatus === order.id}
                        >
                          <option value="Received">Received</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button
                          onClick={() => handleDeleteOrder(order.id, order.service_name)}
                          className="btn btn-danger"
                          style={{ 
                            padding: '0.25rem 0.5rem', 
                            fontSize: '0.75rem',
                            flex: 1
                          }}
                          disabled={deletingId === order.id}
                          title="Delete Order"
                        >
                          {deletingId === order.id ? '⏳' : '🗑️'} Delete Order
                        </button>
                      </div>
                      {updatingStatus === order.id && (
                        <div style={{ fontSize: '0.7rem', color: 'var(--gray-500)' }}>
                          Updating status...
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div style={{ 
        padding: '1rem 1.5rem', 
        textAlign: 'center', 
        color: 'var(--gray-600)', 
        fontSize: '0.875rem',
        borderTop: '1px solid var(--gray-200)',
        background: 'var(--gray-50)'
      }}>
        📊 Showing {orders.length} order{orders.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default OrderList;