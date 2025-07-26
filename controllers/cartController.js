const Cart = require('../models/CartModel.js');
const Order = require("../models/OrderModel.js");
const Product = require('../models/ProductModel.js');
const User = require("../models/UserModel.js");


const auth = require('../auth.js');
const { errorHandler } = auth;

// 1. Get User's Cart
module.exports.getUserCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        // check if the cart is empty
        if (cart.items.length === 0) {
                   return res.status(200).json({ message: 'Your cart is empty' });
        }

        res.status(200).json({cart});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Add to Cart
module.exports.addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;

        const product = await Product.findById(productId);
        if (!product || !product.isActive) {
            return res.status(400).json({ message: 'Invalid or inactive product' });
        }

        const subtotal = product.price * quantity;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [], totalPrice: 0 });
        }

        const existingItem = cart.items.find((item) => item.productId === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.subtotal += subtotal;
        } else {
            cart.items.push({ productId, quantity, subtotal });
        }

        cart.totalPrice = cart.items.reduce((total, item) => total + item.subtotal, 0);
        await cart.save();

        res.status(200).json({ message: 'Item added to cart successfully', cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Change Product Quantities
module.exports.changeQuantity = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;

        const product = await Product.findById(productId);
        if (!product || !product.isActive) {
            return res.status(400).json({ message: 'Invalid or inactive product' });
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const item = cart.items.find((item) => item.productId === productId);
        if (!item) return res.status(404).json({ message: 'Product not found in cart' });

        item.quantity = quantity;
        item.subtotal = product.price * quantity;

        cart.totalPrice = cart.items.reduce((total, item) => total + item.subtotal, 0);
        await cart.save();

        res.status(200).json({ message: 'Item added to cart successfully', cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 4. Remove a Product from Cart
module.exports.removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params; // Retrieve productId from route params

        // Find the user's cart
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        // Check if the product exists in the cart
        const itemIndex = cart.items.findIndex((item) => item.productId === productId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        // Remove the product from the cart
        cart.items.splice(itemIndex, 1);

        // Recalculate total price
        cart.totalPrice = cart.items.reduce((total, item) => total + item.subtotal, 0);

        // Save the cart
        await cart.save();

        // If the cart is now empty, return a specific message
        if (cart.items.length === 0) {
            return res.status(200).json({ message: 'Your cart is now empty' });
        }

        res.status(200).json({ message: 'Item removed from cart successfully', cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 5. Clear Cart
module.exports.clearCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        // Clear the cart
        cart.items = [];
        cart.totalPrice = 0;

        // Save the cleared cart
        await cart.save();

        res.status(200).json({ message: 'Cart cleared successfully', cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

