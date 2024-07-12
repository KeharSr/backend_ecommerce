const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true
    },
    products:{
        type: Array,
        required: true
    },
    totalPrice:{
        type: Number,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    status:{
        type: String,
        default: 'pending'
    },
    date:{
        type: Date,
        default: Date.now()
    },
    payment:{
        type: Boolean,
        default: false
    }
});

const Order = mongoose.model('order', orderSchema);
module.exports = Order;