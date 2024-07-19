const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product',  // Make sure this matches your Product model name
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1  // Ensure there's at least one product
        }
    }],
    totalPrice: {
        type: Number,
        required: true
    },
    address: {
        type: Object,
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String,
        required: true,
    },
    status: {
        type: String,
        default: 'pending'
    },
    date: {
        type: Date,
        default: Date.now
    },
    payment: {
        type: Boolean,
        default: false
    }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
