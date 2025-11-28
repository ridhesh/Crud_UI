import React, { useState, useEffect } from 'react';
import { customerAPI } from '../services/api';
import { showMessage } from '../utils/helpers';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', address: '' });
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadCustomers(); }, []);

  const loadCustomers = async () => {
    try {
      const response = await customerAPI.getAllCustomers();
      setCustomers(response.data.customers);
    } catch (error) {
      showMessage('Failed to load customers', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      showMessage('Name, phone, and address are required', 'error');
      return;
    }

    setLoading(true);
    try {
      if (editingCustomer) {
        await customerAPI.updateCustomer(editingCustomer.id, formData);
        showMessage('Customer updated successfully');
        setEditingCustomer(null);
      } else {
        await customerAPI.addCustomer(formData);
        showMessage('Customer added successfully');
      }
      setFormData({ name: '', phone: '', email: '', address: '' });
      loadCustomers();
    } catch (error) {
      showMessage(error.response?.data?.error || 'Operation failed', 'error');
    }
    setLoading(false);
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      phone: customer.phone,
      email: customer.email || '',
      address: customer.address
    });
  };

  const handleDelete = async (customerId) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;

    try {
      await customerAPI.deleteCustomer(customerId);
      showMessage('Customer deleted successfully');
      loadCustomers();
    } catch (error) {
      showMessage(error.response?.data?.error || 'Delete failed', 'error');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const cancelEdit = () => {
    setEditingCustomer(null);
    setFormData({ name: '', phone: '', email: '', address: '' });
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.formSection}>
          <h2 style={styles.title}>
            {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
          </h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <input type="text" name="name" placeholder="Customer Name" value={formData.name} onChange={handleChange} style={styles.input} required />
            <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} style={styles.input} required />
            <input type="email" name="email" placeholder="Email (Optional)" value={formData.email} onChange={handleChange} style={styles.input} />
            <textarea name="address" placeholder="Address" value={formData.address} onChange={handleChange} style={styles.textarea} required />
            
            <div style={styles.buttonGroup}>
              {editingCustomer && (
                <button type="button" onClick={cancelEdit} style={styles.cancelButton}>
                  Cancel
                </button>
              )}
              <button type="submit" style={styles.button} disabled={loading}>
                {loading ? 'Saving...' : (editingCustomer ? 'Update Customer' : 'Add Customer')}
              </button>
            </div>
          </form>
        </div>

        <div style={styles.listSection}>
          <h2 style={styles.title}>Customer List ({customers.length})</h2>
          <div style={styles.customerGrid}>
            {customers.map(customer => (
              <div key={customer.id} style={styles.customerCard}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.customerName}>{customer.name}</h3>
                  <div style={styles.actionButtons}>
                    <button onClick={() => handleEdit(customer)} style={styles.editButton}>Edit</button>
                    <button onClick={() => handleDelete(customer.id)} style={styles.deleteButton}>Delete</button>
                  </div>
                </div>
                <p style={styles.customerInfo}>📞 {customer.phone}</p>
                {customer.email && <p style={styles.customerInfo}>📧 {customer.email}</p>}
                <p style={styles.customerInfo}>🏠 {customer.address}</p>
                <p style={styles.customerDate}>
                  Joined: {new Date(customer.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '1rem', maxWidth: '1200px', margin: '0 auto' },
  content: { display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' },
  formSection: { backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  listSection: { backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  title: { marginBottom: '1rem', color: '#2c3e50', fontSize: '1.5rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  input: { padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' },
  textarea: { padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem', minHeight: '80px' },
  buttonGroup: { display: 'flex', gap: '0.5rem' },
  button: { padding: '0.75rem 1.5rem', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', fontSize: '1rem', cursor: 'pointer', flex: 1 },
  cancelButton: { padding: '0.75rem 1.5rem', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '4px', fontSize: '1rem', cursor: 'pointer' },
  customerGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' },
  customerCard: { border: '1px solid #e1e8ed', borderRadius: '8px', padding: '1rem', backgroundColor: '#f8f9fa' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' },
  customerName: { margin: 0, color: '#2c3e50' },
  actionButtons: { display: 'flex', gap: '0.5rem' },
  editButton: { padding: '0.25rem 0.5rem', backgroundColor: '#f39c12', color: 'white', border: 'none', borderRadius: '3px', fontSize: '0.8rem', cursor: 'pointer' },
  deleteButton: { padding: '0.25rem 0.5rem', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '3px', fontSize: '0.8rem', cursor: 'pointer' },
  customerInfo: { margin: '0.25rem 0', color: '#666', fontSize: '0.9rem' },
  customerDate: { margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#999' }
};

export default Customers;