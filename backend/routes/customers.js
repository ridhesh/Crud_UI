const express = require('express');
const router = express.Router();
const { addCustomer, getAllCustomers, updateCustomer, deleteCustomer } = require('../controllers/customerController');

// Match EXACTLY what frontend is calling
router.post('/add', addCustomer);
router.get('/all', getAllCustomers);
router.put('/update/:customerId', updateCustomer);
router.delete('/delete/:customerId', deleteCustomer);

module.exports = router;