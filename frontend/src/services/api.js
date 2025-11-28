import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_BASE_URL });

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const customerAPI = {
  addCustomer: (customerData) => api.post('/customers/add', customerData),
  getAllCustomers: () => api.get('/customers/all'),
  updateCustomer: (customerId, customerData) => api.put(`/customers/update/${customerId}`, customerData),
  deleteCustomer: (customerId) => api.delete(`/customers/delete/${customerId}`)
};

export const orderAPI = {
  createOrder: (orderData) => api.post('/orders/create', orderData),
  getAllOrders: () => api.get('/orders/all'),
  deleteOrder: (orderId) => api.delete(`/orders/delete/${orderId}`),
  updateOrderStatus: (orderId, status) => api.put(`/orders/update-status/${orderId}`, { status })
};