import React, { useState, useEffect } from 'react';
import { orderAPI, customerAPI } from '../services/api';

const OrderForm = ({ onOrderCreated }) => {
  const [customers, setCustomers] = useState([]);
  const [services] = useState([
    { name: 'Wash & Fold', price: 5.00, description: 'Regular washing and folding' },
    { name: 'Dry Cleaning', price: 12.00, description: 'Professional dry cleaning' },
    { name: 'Ironing', price: 3.00, description: 'Ironing service only' },
    { name: 'Stain Removal', price: 8.00, description: 'Special stain treatment' },
    { name: 'Express Service', price: 15.00, description: 'Priority fast service' }
  ]);
  
  const [formData, setFormData] = useState({
    customer_id: '',
    service_name: '',
    quantity: 1,
    price_per_unit: 0,
    notes: '',
    priority: 'Medium'
  });
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await customerAPI.getAllCustomers();
      setCustomers(response.data.customers);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setError('Failed to load customers');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleServiceChange = (e) => {
    const serviceName = e.target.value;
    const selectedService = services.find(s => s.name === serviceName);
    
    setFormData(prev => ({
      ...prev,
      service_name: serviceName,
      price_per_unit: selectedService ? selectedService.price : 0
    }));
  };

  const calculateTotal = () => {
    return (formData.quantity * formData.price_per_unit).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    // Validation
    if (!formData.customer_id) {
      setError('Please select a customer');
      setLoading(false);
      return;
    }

    if (!formData.service_name) {
      setError('Please select a service');
      setLoading(false);
      return;
    }

    try {
      const orderData = {
        ...formData,
        quantity: parseInt(formData.quantity),
        price_per_unit: parseFloat(formData.price_per_unit)
      };
      
      console.log('Submitting order:', orderData);
      
      const response = await orderAPI.createOrder(orderData);
      setMessage(`🎉 Order created successfully! Total: ₹${calculateTotal()}`);
      
      // Reset form
      setFormData({ 
        customer_id: '', 
        service_name: '', 
        quantity: 1, 
        price_per_unit: 0, 
        notes: '', 
        priority: 'Medium' 
      });
      
      if (onOrderCreated) {
        onOrderCreated();
      }
    } catch (err) {
      console.error('Order creation error:', err);
      setError(err.message || 'Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">📦 Create New Order</h2>
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
        <div className="grid grid-2">
          <div className="form-group">
            <label className="form-label">Customer *</label>
            <select
              name="customer_id"
              value={formData.customer_id}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select Customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} - {customer.phone}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Service *</label>
            <select
              name="service_name"
              value={formData.service_name}
              onChange={handleServiceChange}
              className="form-select"
              required
            >
              <option value="">Select Service</option>
              {services.map((service) => (
                <option key={service.name} value={service.name}>
                  {service.name} - ₹{service.price}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Quantity *</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="form-input"
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Special Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="form-textarea"
            rows="2"
            placeholder="Any special instructions..."
          />
        </div>

        {/* Order Summary */}
        {formData.service_name && (
          <div className="card" style={{ background: 'rgba(102, 126, 234, 0.05)', border: '1px solid rgba(102, 126, 234, 0.2)' }}>
            <h3 className="card-title">💰 Order Summary</h3>
            <div className="grid grid-3">
              <div>
                <strong>Service:</strong><br />
                {formData.service_name}
              </div>
              <div>
                <strong>Price per unit:</strong><br />
                ₹{formData.price_per_unit}
              </div>
              <div>
                <strong>Total Amount:</strong><br />
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success)' }}>
                  ₹{calculateTotal()}
                </span>
              </div>
            </div>
          </div>
        )}

        <button 
          type="submit" 
          className="btn btn-success"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="loading-spinner"></div>
              Creating Order...
            </>
          ) : (
            '📦 Create Order'
          )}
        </button>
      </form>
    </div>
  );
};

export default OrderForm;