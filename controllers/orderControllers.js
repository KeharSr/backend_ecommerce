const orderModel = require('../models/orderModel');
const userModel = require('../models/userModel'); // Ensure this line is correctly importing the User model

// Placing user order from cart
const placeOrder = async (req, res) => {
    const id = req.user.id; // Assuming req.user.id is correctly populated through your authentication middleware
    try {
        const { userId, products, totalPrice, address, payment } = req.body;

        if (!userId || products.length === 0 || !totalPrice || !address) {
            return res.status(400).send({ message: "Missing required fields." });
        }

        // Create new order
        const newOrder = new orderModel({
            userId: id,
            products: products,
            totalPrice: totalPrice,
            address: address,
            payment: payment
        });

        // Save the order
        const savedOrder = await newOrder.save();

        // Check payment status
        if (payment) {
            // If payment is done, empty the user's cart
            await userModel.updateOne({ _id: id }, { $set: { cart: [] } });
        }

        // Return success response
        res.status(201).json({
            message: "Order placed successfully",
            order: savedOrder
        });
    } catch (error) {
        console.error('Failed to place order:', error);
        res.status(500).json({
            message: "Internal server error" 
        });
    }
}

module.exports = {
    placeOrder
};
