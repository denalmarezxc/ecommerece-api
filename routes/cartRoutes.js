const express = require('express');

//only authenticated users/customers can use/add-to cart  
const { verify } = require('../auth.js');
const cartController = require('../controllers/cartController.js');

const router = express.Router();

// Get User's Cart
router.get('/get-cart', verify, cartController.getUserCart);

// Add to Cart
router.post('/add-to-cart', verify, cartController.addToCart);

// Change Product Quantities
router.patch('/update-cart-quantity', verify, cartController.changeQuantity);

// Remove a Product from Cart
router.patch('/:productId/remove-from-cart', verify, cartController.removeFromCart);

// Clear Cart
router.put('/clear-cart', verify, cartController.clearCart);

module.exports = router;
