const orderModel = require('../models/orderModel');
const userModel = require('../models/userModel'); 
const cartModel = require('../models/cartModel');

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
            await cartModel.updateOne({ _id: userId }, { $set: { product: [] } });
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


// Admin: Get All Orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({}).populate("products.productId");

        // Check if the orders array is empty
        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No orders found',
            });
        }

        // If orders are found, return them
        res.status(200).json({
            success: true,
            message: 'Orders fetched successfully!',
            orders: orders
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error!',
            error: error,
        });
    }
}

// update order status
const updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    try{
        await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            
        });
    }
    catch(error){
        console.log( error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}


module.exports = {
    placeOrder,
    getAllOrders,
    updateOrderStatus
    
};


