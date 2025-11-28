import React, { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';
import { showMessage } from '../utils/helpers';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [updating, setUpdating] = useState(null);

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    try {
      const response = await orderAPI.getAllOrders();
      setOrders(response.data.orders);
    } catch (error) {
      showMessage('Failed to load orders', 'error');
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await orderAPI.updateOrderStatus(orderId, newStatus);
      showMessage('Order status updated successfully');
      loadOrders();
    } catch (error) {
      showMessage('Failed to update order status', 'error');
    }
    setUpdating(null);
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;

    try {
      await orderAPI.deleteOrder(orderId);
      showMessage('Order deleted successfully');
      loadOrders();
    } catch (error) {
      showMessage(error.response?.data?.error || 'Delete failed', 'error');
    }
  };

  const getStatusColor = (status) => {
    const colors = { 'Received': '#3498db', 'In Progress': '#f39c12', 'Completed': '#27ae60', 'Delivered': '#2c3e50' };
    return colors[status] || '#666';
  };

  const getPriorityColor = (priority) => {
    const colors = { 'Low': '#27ae60', 'Medium': '#f39c12', 'High': '#e74c3c' };
    return colors[priority] || '#666';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Order Management ({orders.length} orders)</h2>
      <div style={styles.ordersGrid}>
        {orders.map(order => (
          <div key={order.id} style={styles.orderCard}>
            <div style={styles.orderHeader}>
              <div>
                <h3 style={styles.serviceName}>{order.service_name}</h3>
                <p style={styles.customerName}>{order.customer_name}</p>
              </div>
              <div style={styles.badges}>
                <span style={{...styles.statusBadge, backgroundColor: getStatusColor(order.status)}}>
                  {order.status}
                </span>
                <span style={{...styles.priorityBadge, backgroundColor: getPriorityColor(order.priority)}}>
                  {order.priority}
                </span>
              </div>
            </div>
            
            <div style={styles.orderDetails}>
              <p style={styles.detailItem}><strong>Phone:</strong> {order.customer_phone}</p>
              <p style={styles.detailItem}><strong>Quantity:</strong> {order.quantity}</p>
              <p style={styles.detailItem}><strong>Total:</strong> {formatCurrency(order.total_amount)}</p>
              <p style={styles.detailItem}><strong>Order Date:</strong> {new Date(order.created_date).toLocaleDateString()}</p>
              {order.notes && <p style={styles.detailItem}><strong>Notes:</strong> {order.notes}</p>}
            </div>

            <div style={styles.actionSection}>
              <div style={styles.statusSection}>
                <label style={styles.statusLabel}>Update Status:</label>
                <div style={styles.statusButtons}>
                  {['Received', 'In Progress', 'Completed', 'Delivered'].map(status => (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(order.id, status)}
                      disabled={updating === order.id || order.status === status}
                      style={{
                        ...styles.statusButton,
                        ...(order.status === status ? styles.statusButtonActive : {})
                      }}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
              
              <button 
                onClick={() => handleDelete(order.id)} 
                style={styles.deleteOrderButton}
                disabled={updating === order.id}
              >
                Delete Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '1rem', maxWidth: '1200px', margin: '0 auto' },
  title: { marginBottom: '1.5rem', color: '#2c3e50', fontSize: '1.8rem' },
  ordersGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1rem' },
  orderCard: { backgroundColor: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', border: '1px solid #e1e8ed' },
  orderHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' },
  serviceName: { margin: '0 0 0.25rem 0', color: '#2c3e50', fontSize: '1.1rem' },
  customerName: { margin: 0, color: '#666', fontSize: '0.9rem' },
  badges: { display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'flex-end' },
  statusBadge: { padding: '0.25rem 0.5rem', borderRadius: '12px', color: 'white', fontSize: '0.7rem', fontWeight: 'bold' },
  priorityBadge: { padding: '0.25rem 0.5rem', borderRadius: '12px', color: 'white', fontSize: '0.7rem', fontWeight: 'bold' },
  orderDetails: { marginBottom: '1rem' },
  detailItem: { margin: '0.25rem 0', color: '#666', fontSize: '0.9rem' },
  actionSection: { borderTop: '1px solid #eee', paddingTop: '1rem' },
  statusSection: { marginBottom: '1rem' },
  statusLabel: { display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#2c3e50', fontSize: '0.9rem' },
  statusButtons: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem' },
  statusButton: { padding: '0.4rem', border: '1px solid #ddd', backgroundColor: '#f8f9fa', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem' },
  statusButtonActive: { backgroundColor: '#3498db', color: 'white', borderColor: '#3498db' },
  deleteOrderButton: { width: '100%', padding: '0.5rem', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }
};

export default Orders;