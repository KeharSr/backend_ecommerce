import mongoose  from "mongoose";

const orderSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true
    },
    items:{
        type: Array,
        required: true
    },
    amount:{
        type: Number,
        required: true
    },
    adress:{
        type: Object,
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
export default Order;