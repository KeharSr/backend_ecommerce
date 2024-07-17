const orderModel = require('../models/orderModel');
const userModel = require('../models/userModel'); // Ensure this line is correctly importing the User model

// Placing user order from cart
const placeOrder = async (req, res) => {
    const userId = req.user.id;// Using authenticated user's ID from session
    console.log(req.body) 

    try {
        const { products, totalPrice, address, payment } = req.body;

        // Ensure products array is not empty, and other required fields are present
        if (!products || products.length === 0 ) {
            return res.status(400).send({ message: "No products added to the order" });
        }

        if (!totalPrice || !address) {
            return res.status(400).send({ message: "Missing total price or address details." });
        }

        // Create new order
        const newOrder = new orderModel({
            userId, // Using userId from session for security
            products,
            totalPrice,
            address,
            payment
        });

        // Save the order
        const savedOrder = await newOrder.save();

        // Check payment status
        if (payment) {
            // If payment is done, empty the user's cart
            await userModel.updateOne({ _id: userId }, { $set: { cart: [] } });
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


