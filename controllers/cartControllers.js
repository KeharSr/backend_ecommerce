
const path = require('path');
const userModel = require('../models/userModel');
const productModel = require('../models/productModel');
const cartModel = require('../models/cartModel');
const fs = require('fs');


// add items to user cart
const addToCart = async (req, res) => {
    const { productId,quantity } = req.body;
    const id = req.user.id;
    console.log(id);

    try {
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found!'
            });
        }
        const existingProduct = await cartModel.findOne({ productId: productId, userId: id });
        if (existingProduct) {
            return res.json({
                success: false,
                message: 'Product already in cart!'
            });
        }
        const cart = new cartModel({
            productId: productId,
            userId: id,
            quantity: quantity


        });

        await cart.save();

        res.status(201).json({
            success: true,
            message: 'Product added to cart successfully!'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error!'
        });
    }
}

// remove items from user cart
const removeFromCart = async (req, res) => {
    const { productId } = req.params;
    const { userId } = req.user;

    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found!'
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error!'
        });
    }

}


// fetch user cart data
const getCart = async (req, res) => {
    const id = req.user.id;

    try {
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found!'
            });
        }

        const cartItems = await cartModel.find({ userId: id }).populate('productId');
        console.log(cartItems);

        res.status(200).json({
            success: true,
            products: cartItems
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error!'
        });
    }
}


module.exports = {
    addToCart,
    removeFromCart,
    getCart,
    
}