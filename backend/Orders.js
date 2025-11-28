import React, { useState, useEffect } from 'react'; 
import { orderAPI } from '../services/api'; 
import { showMessage } from '../utils/helpers'; 
 
const Orders = () => {
  const [orders, setOrders] = useState([]); 
  const [updating, setUpdating] = useState(null); 
 
  useEffect(() => {
    loadOrders(); 
  }, []); 
 
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
 
  const getStatusColor = (status) => {
    const colors = { 
      'Received': '#3498db', 
      'In Progress': '#f39c12', 
      'Completed': '#27ae60', 
      'Delivered': '#2c3e50' 
    }; 
    return colors[status] || '#666';
  }; 
 
  const statusOptions = ['Received', 'In Progress', 'Completed', 'Delivered'];
 
  return ( 
    <div style={styles.container}>
      <h2 style={styles.title}>Order Management</h2>
      <div style={styles.ordersGrid}>
        {orders.map((order) => (
          <div key={order.id} style={styles.orderCard}>
            <div style={styles.orderHeader}>
              <h3 style={styles.serviceName}>{order.service_name}</h3>
              <span 
                style={{ 
                  ...styles.statusBadge, 
                  backgroundColor: getStatusColor(order.status) 
                }}
              >
                {order.status}
              </span>
            </div>

            <div style={styles.orderDetails}>
              <p style={styles.detailItem}>
                <strong>Customer: </strong>{order.customer_name}
              </p>
              <p style={styles.detailItem}>
                <strong>Phone: </strong>{order.customer_phone}
              </p>
              <p style={styles.detailItem}>
                <strong>Quantity: </strong>{order.quantity}
              </p>
              <p style={styles.detailItem}>
                <strong>Order Date: </strong>{new Date(order.created_date).toLocaleDateString()}
              </p>
            </div>

            <div style={styles.statusSection}>
              <label style={styles.statusLabel}>Update Status:</label>
              <div style={styles.statusButtons}>
                {statusOptions.map((status) => (
                  <button 
                    key={status}
                    onClick={() => handleStatusUpdate(order.id, status)}
                    disabled={updating === order.id}
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
          </div>
        ))}
      </div>
    </div>
  ); 
}; 
 
const styles = { 
  container: { 
    padding: '2rem', 
    maxWidth: '1200px', 
    margin: '0 auto', 
  }, 
  title: { 
    marginBottom: '2rem', 
    color: '#2c3e50', 
    fontSize: '1.8rem', 
  }, 
  ordersGrid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
    gap: '1.5rem', 
  }, 
  orderCard: { 
    backgroundColor: 'white', 
    padding: '1.5rem', 
    borderRadius: '8px', 
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)', 
    border: '1px solid #e1e8ed', 
  }, 
  orderHeader: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start', 
    marginBottom: '1rem', 
  }, 
  serviceName: { 
    margin: 0, 
    color: '#2c3e50', 
    fontSize: '1.2rem', 
  }, 
  statusBadge: { 
    padding: '0.25rem 0.75rem', 
    borderRadius: '20px', 
    color: 'white', 
    fontSize: '0.8rem', 
    fontWeight: 'bold', 
  }, 
  orderDetails: { 
    marginBottom: '1.5rem', 
  }, 
  detailItem: { 
    margin: '0.5rem 0', 
    color: '#666', 
  }, 
  statusSection: { 
    borderTop: '1px solid #eee', 
    paddingTop: '1rem', 
  }, 
  statusLabel: { 
    display: 'block', 
    marginBottom: '0.5rem', 
    fontWeight: 'bold', 
    color: '#2c3e50', 
  }, 
  statusButtons: { 
    display: 'grid', 
    gridTemplateColumns: '1fr 1fr', 
    gap: '0.5rem', 
  }, 
  statusButton: { 
    padding: '0.5rem', 
    border: '1px solid #ddd', 
    backgroundColor: '#f8f9fa', 
    borderRadius: '4px', 
    cursor: 'pointer', 
    fontSize: '0.8rem', 
  }, 
  statusButtonActive: { 
    backgroundColor: '#3498db', 
    color: 'white', 
    borderColor: '#3498db', 
  }, 
}; 
 
export default Orders;