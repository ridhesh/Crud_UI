const db = require('../config/database');

const addCustomer = (req, res) => {
  const { name, phone, email, address } = req.body;

  console.log('📝 Adding new customer:', { name, phone, email, address });

  if (!name || !phone || !address) {
    return res.status(400).json({ error: 'Name, phone, and address are required' });
  }

  if (phone.length < 10) {
    return res.status(400).json({ error: 'Phone number must be at least 10 digits' });
  }

  const query = 'INSERT INTO customers (name, phone, email, address) VALUES (?, ?, ?, ?)';
  
  db.query(query, [name, phone, email || null, address], (err, result) => {
    if (err) {
      console.error('❌ Database error:', err);
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'Phone number already exists' });
      }
      return res.status(500).json({ 
        error: 'Database error', 
        details: err.message 
      });
    }
    
    console.log(`✅ Customer added successfully with ID: ${result.insertId}`);
    res.status(201).json({ 
      message: 'Customer added successfully', 
      customerId: result.insertId 
    });
  });
};

const getAllCustomers = (req, res) => {
  console.log('📋 Fetching all customers');
  
  const query = 'SELECT * FROM customers ORDER BY created_at DESC';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Database error:', err);
      return res.status(500).json({ 
        error: 'Database error', 
        details: err.message 
      });
    }
    
    console.log(`✅ Found ${results.length} customers`);
    res.json({ customers: results });
  });
};

const updateCustomer = (req, res) => {
  const { customerId } = req.params;
  const { name, phone, email, address } = req.body;

  console.log(`✏️ Updating customer ${customerId}:`, { name, phone, email, address });

  if (!name || !phone || !address) {
    return res.status(400).json({ error: 'Name, phone, and address are required' });
  }

  if (phone.length < 10) {
    return res.status(400).json({ error: 'Phone number must be at least 10 digits' });
  }

  // Check if phone already exists for other customers
  const checkPhoneQuery = 'SELECT id FROM customers WHERE phone = ? AND id != ?';
  
  db.query(checkPhoneQuery, [phone, customerId], (err, results) => {
    if (err) {
      console.error('❌ Database error:', err);
      return res.status(500).json({ 
        error: 'Database error', 
        details: err.message 
      });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: 'Phone number already exists for another customer' });
    }

    // Update customer
    const updateQuery = `
      UPDATE customers 
      SET name = ?, phone = ?, email = ?, address = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;
    
    db.query(updateQuery, [name, phone, email || null, address, customerId], (err, result) => {
      if (err) {
        console.error('❌ Database error:', err);
        return res.status(500).json({ 
          error: 'Database error',
          details: err.message 
        });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Customer not found' });
      }
      
      console.log(`✅ Customer ${customerId} updated successfully`);
      res.json({ 
        message: 'Customer updated successfully',
        customerId: customerId
      });
    });
  });
};

const deleteCustomer = (req, res) => {
  const { customerId } = req.params;

  console.log(`🗑️ Deleting customer ${customerId}`);

  const query = 'DELETE FROM customers WHERE id = ?';
  
  db.query(query, [customerId], (err, result) => {
    if (err) {
      console.error('❌ Database error:', err);
      
      // Handle foreign key constraint error
      if (err.code === 'ER_ROW_IS_REFERENCED_2' || err.errno === 1451) {
        return res.status(400).json({ 
          error: 'Cannot delete customer with existing orders. Delete orders first.',
          details: 'This customer has associated orders in the system.'
        });
      }
      
      return res.status(500).json({ 
        error: 'Database error',
        details: err.message 
      });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    console.log(`✅ Customer ${customerId} deleted successfully`);
    res.json({ 
      message: 'Customer deleted successfully',
      deletedCustomerId: customerId
    });
  });
};

module.exports = { 
  addCustomer, 
  getAllCustomers, 
  updateCustomer,
  deleteCustomer
};