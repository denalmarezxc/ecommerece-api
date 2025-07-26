const express = require("express");
const orderController = require('../controllers/orderController.js');
const { verify, verifyAdmin } = require("../auth.js");

// Router
const router = express.Router();

// Create a new order
router.post('/checkout', verify, orderController.createOrder);

// Get a user's orders
router.get('/my-orders', verify, orderController.getUserOrders);

// Get all orders (Admin only)
router.get('/all-orders', verify, verifyAdmin, orderController.getAllOrders);

// Export the router
module.exports = router;
