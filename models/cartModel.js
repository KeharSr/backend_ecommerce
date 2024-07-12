const mongoose = require('mongoose');

// Cart Schema Definition
const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    quantity: {
        type: Number,
        default: 1,
        
    }
    
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
