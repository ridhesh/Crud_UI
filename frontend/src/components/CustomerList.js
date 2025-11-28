import React, { useState, useEffect } from 'react';
import { customerAPI } from '../services/api';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [editCustomer, setEditCustomer] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });
  const [updatingId, setUpdatingId] = useState(null);

  const fetchCustomers = async () => {
    try {
      setError('');
      console.log('🔄 Fetching customers...');
      const response = await customerAPI.getAllCustomers();
      console.log('✅ Customers fetched:', response.data.customers);
      setCustomers(response.data.customers || []);
    } catch (err) {
      console.error('❌ Error fetching customers:', err);
      setError('Failed to load customers. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDeleteCustomer = async (customerId, customerName) => {
    if (!window.confirm(`Are you sure you want to delete customer: ${customerName}?`)) {
      return;
    }

    setDeletingId(customerId);
    try {
      await customerAPI.deleteCustomer(customerId);
      // Remove from local state
      setCustomers(customers.filter(customer => customer.id !== customerId));
      console.log(`✅ Customer ${customerName} deleted successfully`);
    } catch (err) {
      console.error('❌ Error deleting customer:', err);
      alert(err.response?.data?.error || 'Failed to delete customer');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditClick = (customer) => {
    setEditCustomer(customer.id);
    setEditForm({
      name: customer.name,
      phone: customer.phone,
      email: customer.email || '',
      address: customer.address
    });
  };

  const handleEditSave = async (customerId) => {
    setUpdatingId(customerId);
    try {
      // Call update API
      await customerAPI.updateCustomer(customerId, editForm);
      
      // Update local state
      setCustomers(customers.map(customer => 
        customer.id === customerId 
          ? { ...customer, ...editForm }
          : customer
      ));
      
      setEditCustomer(null);
      console.log(`✅ Customer ${customerId} updated successfully`);
    } catch (err) {
      console.error('❌ Error updating customer:', err);
      alert(err.response?.data?.error || 'Failed to update customer');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleEditCancel = () => {
    setEditCustomer(null);
    setEditForm({ name: '', phone: '', email: '', address: '' });
  };

  const handleEditChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="card">
        <div className="loading">
          <div className="loading-spinner"></div>
          Loading customers...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="alert alert-error">
          ❌ {error}
        </div>
        <button onClick={fetchCustomers} className="btn btn-primary">
          🔄 Retry
        </button>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">📋 Customer List</h2>
        <button 
          onClick={fetchCustomers}
          className="btn btn-outline"
          disabled={loading}
        >
          🔄 Refresh
        </button>
      </div>

      {customers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <h3>No customers found</h3>
          <p>Add your first customer to get started</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table" style={{ tableLayout: 'fixed', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ width: '60px' }}>ID</th>
                <th style={{ width: '120px' }}>Name</th>
                <th style={{ width: '110px' }}>Phone</th>
                <th style={{ width: '150px' }}>Email</th>
                <th style={{ width: '200px' }}>Address</th>
                <th style={{ width: '100px' }}>Joined</th>
                <th style={{ width: '150px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td style={{ fontWeight: 'bold' }}>#{customer.id}</td>
                  
                  <td>
                    {editCustomer === customer.id ? (
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => handleEditChange('name', e.target.value)}
                        className="form-input"
                        style={{ padding: '0.25rem', fontSize: '0.9rem', width: '100%' }}
                        required
                      />
                    ) : (
                      <strong>{customer.name}</strong>
                    )}
                  </td>
                  
                  <td>
                    {editCustomer === customer.id ? (
                      <input
                        type="text"
                        value={editForm.phone}
                        onChange={(e) => handleEditChange('phone', e.target.value)}
                        className="form-input"
                        style={{ padding: '0.25rem', fontSize: '0.9rem', width: '100%' }}
                        required
                      />
                    ) : (
                      <span style={{ fontFamily: 'monospace' }}>{customer.phone}</span>
                    )}
                  </td>
                  
                  <td>
                    {editCustomer === customer.id ? (
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => handleEditChange('email', e.target.value)}
                        className="form-input"
                        style={{ padding: '0.25rem', fontSize: '0.9rem', width: '100%' }}
                      />
                    ) : customer.email ? (
                      <a 
                        href={`mailto:${customer.email}`} 
                        style={{ color: 'var(--primary)', textDecoration: 'none' }}
                        title={customer.email}
                      >
                        {customer.email.length > 15 ? 
                          customer.email.substring(0, 15) + '...' : 
                          customer.email
                        }
                      </a>
                    ) : (
                      <span style={{ color: 'var(--gray-400)', fontStyle: 'italic' }}>
                        No email
                      </span>
                    )}
                  </td>
                  
                  <td>
                    {editCustomer === customer.id ? (
                      <textarea
                        value={editForm.address}
                        onChange={(e) => handleEditChange('address', e.target.value)}
                        className="form-input"
                        style={{ padding: '0.25rem', fontSize: '0.9rem', width: '100%', height: '60px' }}
                        rows="2"
                        required
                      />
                    ) : (
                      <span 
                        style={{ 
                          maxWidth: '200px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          cursor: 'pointer'
                        }}
                        title={customer.address}
                      >
                        {customer.address}
                      </span>
                    )}
                  </td>
                  
                  <td style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                    {new Date(customer.created_at).toLocaleDateString('en-IN')}
                  </td>
                  
                  <td>
                    {editCustomer === customer.id ? (
                      <div style={{ display: 'flex', gap: '0.25rem', flexDirection: 'column' }}>
                        <button
                          onClick={() => handleEditSave(customer.id)}
                          className="btn btn-success"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                          disabled={updatingId === customer.id}
                        >
                          {updatingId === customer.id ? '⏳' : '💾'} Save
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="btn btn-outline"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                          disabled={updatingId === customer.id}
                        >
                          ❌ Cancel
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '0.25rem', flexDirection: 'column' }}>
                        <button
                          onClick={() => handleEditClick(customer)}
                          className="btn btn-warning"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                          title="Edit Customer"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCustomer(customer.id, customer.name)}
                          className="btn btn-danger"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                          disabled={deletingId === customer.id}
                          title="Delete Customer"
                        >
                          {deletingId === customer.id ? '⏳' : '🗑️'} Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ 
            padding: '1rem', 
            textAlign: 'center', 
            color: 'var(--gray-600)', 
            fontSize: '0.875rem',
            borderTop: '1px solid var(--gray-200)',
            background: 'var(--gray-50)'
          }}>
            📊 Showing {customers.length} customer{customers.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;