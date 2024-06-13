

const path = require('path');
const productModel = require('../models/productModel');
const fs = require('fs');

const createProduct = async (req, res) => {
    console.log(req.body);
    console.log(req.files);

    const { productName, productPrice, productCategory, productDescription } = req.body;

    if (!productName || !productPrice || !productCategory || !productDescription) {
        return res.status(400).json({
            success: false,
            message: 'Please enter all details!'
        });
    }

    if (!req.files || !req.files.productImage) {
        return res.status(400).json({
            success: false,
            message: 'Please upload an image!'
        });
    }

    const { productImage } = req.files;

    try {
        const imagePath = path.join(__dirname, `../public/products/${productImage.name}`);
        await productImage.mv(imagePath);

        const newProduct = new productModel({
            productName: productName,
            productPrice: productPrice,
            productCategory: productCategory,
            productDescription: productDescription,
            productImage: imagePath // Save the path of the image
        });

        await newProduct.save();

        res.status(201).json({
            success: true,
            message: 'Product Created Successfully!'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error!'
        });
    }
};





// get the all products

const getAllProducts = async (req, res) => {
    try {
        const allproducts = await productModel.find({});
        res.status(201).json({
            success: true,
            message: 'Products Fetched Successfully!',
            products: allproducts
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

module.exports = {
    createProduct,
    getAllProducts
};
