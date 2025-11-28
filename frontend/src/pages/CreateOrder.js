import React, { useState, useEffect } from 'react';
import { customerAPI, orderAPI } from '../services/api';
import { showMessage } from '../utils/helpers';

const CreateOrder = () => {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    customer_id: '',
    service_name: '',
    quantity: 1,
    price_per_unit: '',
    notes: '',
    priority: 'Medium'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

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
    
    if (!formData.customer_id || !formData.service_name || !formData.quantity) {
      showMessage('Customer, service type, and quantity are required', 'error');
      return;
    }

    if (formData.quantity <= 0) {
      showMessage('Quantity must be greater than zero', 'error');
      return;
    }

    setLoading(true);
    try {
      await orderAPI.createOrder(formData);
      showMessage('Order created successfully');
      setFormData({
        customer_id: '',
        service_name: '',
        quantity: 1,
        price_per_unit: '',
        notes: '',
        priority: 'Medium'
      });
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to create order';
      showMessage(message, 'error');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Auto-calculate price for standard services
    if (name === 'service_name') {
      const servicePrices = {
        'Wash & Fold': 5.00,
        'Dry Cleaning': 12.00,
        'Ironing': 3.00,
        'Stain Removal': 8.00,
        'Express Service': 15.00
      };
      const price = servicePrices[value] || '';
      setFormData(prev => ({
        ...prev,
        price_per_unit: price
      }));
    }
  };

  const serviceOptions = [
    'Wash & Fold',
    'Dry Cleaning', 
    'Ironing',
    'Stain Removal',
    'Express Service',
    'Special Care'
  ];

  const calculateTotal = () => {
    const quantity = parseFloat(formData.quantity) || 0;
    const price = parseFloat(formData.price_per_unit) || 0;
    return (quantity * price).toFixed(2);
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Create New Order</h2>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Customer Selection */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Select Customer *</label>
            <select
              name="customer_id"
              value={formData.customer_id}
              onChange={handleChange}
              style={styles.select}
              required
            >
              <option value="">Choose a customer...</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} - {customer.phone}
                </option>
              ))}
            </select>
          </div>

          {/* Service Type */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Service Type *</label>
            <select
              name="service_name"
              value={formData.service_name}
              onChange={handleChange}
              style={styles.select}
              required
            >
              <option value="">Select service type...</option>
              {serviceOptions.map(service => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity and Price */}
          <div style={styles.grid2}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Quantity *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                max="100"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Price per Unit (₹)</label>
              <input
                type="number"
                name="price_per_unit"
                value={formData.price_per_unit}
                onChange={handleChange}
                min="0"
                step="0.01"
                style={styles.input}
                placeholder="Auto-calculated"
              />
            </div>
          </div>

          {/* Priority */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* Notes */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Notes (Optional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              style={styles.textarea}
              placeholder="Any special instructions..."
              rows="3"
            />
          </div>

          {/* Total Calculation */}
          {formData.price_per_unit && (
            <div style={styles.totalSection}>
              <div style={styles.totalLabel}>Total Amount:</div>
              <div style={styles.totalAmount}>₹{calculateTotal()}</div>
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            style={styles.button}
            disabled={loading}
          >
            {loading ? 'Creating Order...' : 'Create Order'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '1rem',
    display: 'flex',
    justifyContent: 'center',
    minHeight: '80vh'
  },
  formContainer: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '600px'
  },
  title: {
    marginBottom: '2rem',
    color: '#2c3e50',
    textAlign: 'center',
    fontSize: '1.8rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem'
  },
  label: {
    marginBottom: '0.5rem',
    fontWeight: 'bold',
    color: '#2c3e50',
    fontSize: '0.9rem'
  },
  select: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    backgroundColor: 'white'
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem'
  },
  textarea: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    resize: 'vertical',
    minHeight: '80px'
  },
  totalSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    border: '1px solid #e9ecef'
  },
  totalLabel: {
    fontWeight: 'bold',
    color: '#2c3e50'
  },
  totalAmount: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#27ae60'
  },
  button: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '1rem'
  }
};

export default CreateOrder;