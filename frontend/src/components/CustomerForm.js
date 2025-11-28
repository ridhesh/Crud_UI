import React, { useState } from 'react';
import { customerAPI } from '../services/api';

const CustomerForm = ({ onCustomerAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError('');
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({
      ...touched,
      [name]: true
    });
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.phone.trim()) errors.phone = 'Phone is required';
    else if (formData.phone.length < 10) errors.phone = 'Phone must be at least 10 digits';
    if (!formData.address.trim()) errors.address = 'Address is required';
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setError('Please fix the errors below');
      setTouched(Object.keys(errors).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
      setLoading(false);
      return;
    }

    try {
      const response = await customerAPI.addCustomer(formData);
      setMessage('🎉 Customer added successfully!');
      setFormData({ name: '', phone: '', email: '', address: '' });
      setTouched({});
      if (onCustomerAdded) {
        onCustomerAdded();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add customer');
    } finally {
      setLoading(false);
    }
  };

  const errors = validateForm();

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">👥 Add New Customer</h2>
        <div className="loading">
          {loading && <div className="loading-spinner"></div>}
        </div>
      </div>

      {message && (
        <div className="alert alert-success">
          ✅ {message}
        </div>
      )}
      
      {error && (
        <div className="alert alert-error">
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Full Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className="form-input"
            placeholder="Enter customer's full name"
            required
          />
          {touched.name && errors.name && (
            <div style={{ color: 'var(--danger)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              ❌ {errors.name}
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Phone Number *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            className="form-input"
            placeholder="Enter 10-digit phone number"
            required
          />
          {touched.phone && errors.phone && (
            <div style={{ color: 'var(--danger)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              ❌ {errors.phone}
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className="form-input"
            placeholder="Enter email address (optional)"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Address *</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            onBlur={handleBlur}
            className="form-textarea"
            rows="3"
            placeholder="Enter complete address"
            required
          />
          {touched.address && errors.address && (
            <div style={{ color: 'var(--danger)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              ❌ {errors.address}
            </div>
          )}
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="loading-spinner"></div>
              Adding Customer...
            </>
          ) : (
            '➕ Add Customer'
          )}
        </button>
      </form>
    </div>
  );
};

export default CustomerForm;