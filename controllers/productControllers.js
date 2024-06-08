const path = require('path');
const productModel = require('../models/productModel');

const createProduct = async (req, res) => {
    console.log(req.body);

    const { productName, productPrice, productCategory, productDescription, productImage } = req.body;

    if (!productName || !productPrice || !productCategory || !productDescription || !productImage) {
        return res.json({
            status: false,
            message: 'Plz enter all details!'
        })
    }

    try {
        const newProduct = new productModel({
            productName: productName,
            productPrice: productPrice,
            productCategory: productCategory,
            productDescription: productDescription,
            productImage: productImage
        })

        await newProduct.save()

        res.json({
            status: true,
            message: 'Product Created Successfully!'
        })

    } catch (error) {
        console.log(error);
        res.json({
            status: false,
            message: 'Internal Server Error!'
        })
    }
}