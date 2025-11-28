const express = require('express');
const router = express.Router();
const { createOrder, getAllOrders, deleteOrder, updateOrderStatus } = require('../controllers/orderController');

// Match EXACTLY what frontend is calling
router.post('/create', createOrder);
router.get('/all', getAllOrders);
router.delete('/delete/:orderId', deleteOrder);
router.put('/update-status/:orderId', updateOrderStatus);

module.exports = router;