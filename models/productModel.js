const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    productPrice: {
        type: Number,
        required: true
    },
    productCategory: {
        type: String,
        required: true
    },
    productDescription: {
        type: String,
        required: true,
        maxLength : 500
    },
    productImage: {
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now()
    
    },
    productQuantity:{
        type: Number,  
    },
    ratingsAverage: {
        type: Number,
        default: 4.0,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        set: val => Math.round(val * 10) / 10 // Round to 1 decimal place
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },

})

const Product = mongoose.model('product', productSchema)
module.exports = Product;