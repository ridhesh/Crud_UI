import React, { useState, useEffect } from 'react'; 
import { customerAPI, orderAPI } from '../services/api'; 
import { showMessage } from '../utils/helpers'; 
 
const CreateOrder = () => {
  const [customers, setCustomers] = useState([]); 
  const [formData, setFormData] = useState({ 
    customer_id: '', 
    service_name: '', 
    quantity: 1 
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
      showMessage('All fields are required', 'error'); 
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
        quantity: 1 
      }); 
    } catch (error) { 
      showMessage(error.message, 'error'); 
    } 
    setLoading(false); 
  }; 
 
  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    }); 
  }; 
 
  const serviceOptions = [ 
    'Dry Cleaning', 
    'Ironing', 
    'Stain Removal', 
    'Special Care' 
  ]; 
 
  return ( 
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Create New Order</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Select Customer</label>
            <select 
              name="customer_id"
              value={formData.customer_id}
              onChange={handleChange}
              style={styles.select}
              required
            >
              <option value="">Choose a customer...</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} - {customer.phone}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Service Type</label>
            <select 
              name="service_name"
              value={formData.service_name}
              onChange={handleChange}
              style={styles.select}
              required
            >
              <option value="">Select service...</option>
              {serviceOptions.map((service) => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Quantity</label>
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
    padding: '2rem', 
    display: 'flex', 
    justifyContent: 'center', 
  }, 
  formContainer: { 
    backgroundColor: 'white', 
    padding: '2rem', 
    borderRadius: '8px', 
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)', 
    width: '100%', 
    maxWidth: '500px', 
  }, 
  title: { 
    marginBottom: '2rem', 
    color: '#2c3e50', 
    textAlign: 'center', 
  }, 
  form: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '1.5rem', 
  }, 
  formGroup: { 
    display: 'flex', 
    flexDirection: 'column', 
  }, 
  label: { 
    marginBottom: '0.5rem', 
    fontWeight: 'bold', 
    color: '#2c3e50', 
  }, 
  select: { 
    padding: '0.75rem', 
    border: '1px solid #ddd', 
    borderRadius: '4px', 
    fontSize: '1rem', 
  }, 
  input: { 
    padding: '0.75rem', 
    border: '1px solid #ddd', 
    borderRadius: '4px', 
    fontSize: '1rem', 
  }, 
  button: { 
    padding: '0.75rem 1.5rem', 
    backgroundColor: '#27ae60', 
    color: 'white', 
    border: 'none', 
    borderRadius: '4px', 
    fontSize: '1rem', 
    cursor: 'pointer', 
    marginTop: '1rem', 
  }, 
}; 

export default CreateOrder;