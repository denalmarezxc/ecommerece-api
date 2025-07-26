const Product = require("../models/ProductModel.js");
const Order = require("../models/OrderModel.js");
const Cart = require("../models/CartModel.js");
const auth = require("../auth.js");
const { errorHandler } = auth;

// Create Order 
module.exports.createOrder = async (req, res) => {
    try {
        // Validate user via token
        const userId = req.user.id;

        // Find the user's cart
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Check if cart has items
        if (!cart.items.length) {
            return res.status(400).json({ message: "No Items to checkout" });
        }

        // Create a new Order document
        const newOrder = new Order({
            userId,
            productsOrdered: cart.items, // Use cart items as productsOrdered
            totalPrice: cart.totalPrice, // Use cart's totalPrice
        });

        // Save the order
        const savedOrder = await newOrder.save();

        // Clear the cart
        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();

        // Respond with success and order details
        res.status(201).json({ message: "Ordered successfully", order: savedOrder }); //remove <, order: savedOrder> if error occurs, but this should be the code if strictly following the instructions
    } catch (error) {
        // Catch and send error details
        res.status(500).json({ message: "Failed to create order", error: error.message });
    }
};


// Retrieve a user's orders
module.exports.getUserOrders = async (req, res) => {
    try {
        // Validate user via token
        const userId = req.user.id;

        // Find orders by user ID
        const userOrders = await Order.find({ userId });
        if (!userOrders.length) {
            return res.status(404).json({ message: "No orders found for this user" });
        }

        // Respond with orders
        res.status(200).json({userOrders});
    } catch (error) {
        // Catch and send error details
        res.status(500).json({ message: "Failed to retrieve orders", error: error.message });
    }
};


// Retrieve all orders 
module.exports.getAllOrders = async (req, res) => {
    try {
        // Find all orders
        const allOrders = await Order.find();

        // Respond with all orders
        res.status(200).json({allOrders});
    } catch (error) {
        // Catch and send error details
        res.status(500).json({ message: "Failed to retrieve orders", error: error.message });
    }
};
