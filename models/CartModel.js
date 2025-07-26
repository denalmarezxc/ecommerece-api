const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, 'User ID is required'],
    },
    items: [
        {
            productId: {
                type: String,
                required: [true, 'Product ID is required'],
            },
            quantity: {
                type: Number,
                default: 1,
                min: [1, 'Quantity must be at least 1'],
            },
            subtotal: {
                type: Number,
                default: 0, // Calculated dynamically
            },
        },
    ],
    totalPrice: {
        type: Number,
        default: 0, // Calculated dynamically
    },
    orderedOn: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Cart', cartSchema);