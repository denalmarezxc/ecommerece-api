const mongoose = require('mongoose');

// Schema/blueprint
const orderSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: [true, "User ID is Required"]
	},
	productsOrdered: [
			{
				productId: {
					type: String,
					required: [true, 'Product ID is Required']
				},
				quantity: {
                    type: Number,
                    default: 1,
                    required: [true, 'Order quantity is required']
                },
                subtotal: {
                    type: Number,
                    required: [true, 'subtotal is Required']
                }
            
			}

		],
	totalPrice: {
		type: Number,
		required: [true, 'totalPrice is Required']
	},
	orderedOn:{
		type: Date,
		default: Date.now
	},
	status: {
		type: String,
		default: "Pending"
	}
})

// Model
module.exports = mongoose.model('Order', orderSchema);