const db = require('../config/database');

const createOrder = (req, res) => {
  const { customer_id, service_name, quantity, price_per_unit, notes, priority } = req.body;

  console.log('📦 Creating new order:', { customer_id, service_name, quantity, price_per_unit, notes, priority });

  if (!customer_id || !service_name || !quantity) {
    return res.status(400).json({ 
      error: 'Customer ID, service name, and quantity are required'
    });
  }

  if (quantity <= 0) {
    return res.status(400).json({ error: 'Quantity must be greater than zero' });
  }

  const calculatedPricePerUnit = price_per_unit || getServicePrice(service_name);
  const total_amount = (quantity * calculatedPricePerUnit).toFixed(2);

  const query = `
    INSERT INTO orders 
    (customer_id, service_name, quantity, price_per_unit, total_amount, notes, priority) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  
  const values = [
    parseInt(customer_id), 
    service_name, 
    parseInt(quantity), 
    parseFloat(calculatedPricePerUnit), 
    parseFloat(total_amount),
    notes || '',
    priority || 'Medium'
  ];

  console.log('📊 Order values:', values);

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('❌ Database error:', err);
      return res.status(500).json({ 
        error: 'Database error',
        details: err.message
      });
    }
    
    console.log(`✅ Order created successfully with ID: ${result.insertId}`);
    res.status(201).json({ 
      message: 'Order created successfully', 
      orderId: result.insertId,
      totalAmount: total_amount
    });
  });
};

const getAllOrders = (req, res) => {
  console.log('📋 Fetching all orders');
  
  const query = `
    SELECT 
      o.*, 
      c.name as customer_name, 
      c.phone as customer_phone,
      c.email as customer_email,
      c.address as customer_address
    FROM orders o 
    LEFT JOIN customers c ON o.customer_id = c.id 
    ORDER BY o.created_date DESC
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Error fetching orders:', err);
      return res.status(500).json({ 
        error: 'Database error',
        details: err.message
      });
    }
    
    console.log(`✅ Found ${results.length} orders`);
    res.json({ orders: results });
  });
};

const deleteOrder = (req, res) => {
  const { orderId } = req.params;

  console.log(`🗑️ Deleting order: ${orderId}`);

  const query = 'DELETE FROM orders WHERE id = ?';
  
  db.query(query, [orderId], (err, result) => {
    if (err) {
      console.error('❌ Delete error:', err);
      return res.status(500).json({ 
        error: 'Delete failed',
        details: err.message
      });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    console.log(`✅ Order ${orderId} deleted successfully`);
    res.json({ 
      message: 'Order deleted successfully',
      deletedOrderId: orderId
    });
  });
};

const updateOrderStatus = (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  console.log(`🔄 Updating order ${orderId} status to: ${status}`);

  const validStatuses = ['Received', 'In Progress', 'Completed', 'Delivered'];
  
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const query = 'UPDATE orders SET status = ? WHERE id = ?';
  
  db.query(query, [status, orderId], (err, result) => {
    if (err) {
      console.error('❌ Database error:', err);
      return res.status(500).json({ 
        error: 'Database error',
        details: err.message
      });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    console.log(`✅ Order ${orderId} status updated to ${status}`);
    res.json({ message: 'Order status updated successfully' });
  });
};

const getServicePrice = (serviceName) => {
  const servicePrices = {
    'Wash & Fold': 5.00,
    'Dry Cleaning': 12.00,
    'Ironing': 3.00,
    'Stain Removal': 8.00,
    'Express Service': 15.00,
    'Special Care': 20.00
  };
  return servicePrices[serviceName] || 10.00;
};

module.exports = { 
  createOrder, 
  getAllOrders, 
  deleteOrder,
  updateOrderStatus
};