

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

        const imageName=`${Date.now()}_${productImage.name}`
        const imagePath = path.join(__dirname, `../public/products/${imageName}`);
        await productImage.mv(imagePath);

        const newProduct = new productModel({
            productName: productName,
            productPrice: productPrice,
            productCategory: productCategory,
            productDescription: productDescription,
            productImage: imageName // Save the path of the image
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


//delete product
const deleteProduct = async (req, res) => {
    try{
        await productModel.findByIdAndDelete(req.params.id)
        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        })

    }catch (error){
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error
        })
    
    





    }
}

// get single products

const getSingleProduct = async (req, res) => {
    //get product id from url
    const productId = req.params.id
 
    try {
        const product = await productModel.findById(productId)
 
        if (!product) {
            res.status(400).json({
                "success": false,
                "message": "No product found",
            })
        }
        res.status(201).json({
            "success": true,
            "message": "product fetched",
            "product": product
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            "success": false,
            "messgae": "internal server error",
            "error": error,
        })
 
    }
 
 
 
}



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

// update product
const updateProduct = async (req, res) => {
    try{
        // if there is image
        if(req.files && req.files.productImage){
            //destructing
            const {productImage} = req.files;

            //upload image to directory(/public/products folder)
            const imageName = `${Date.now()}-${productImage.name}`;
 
            //2. make an upload path (/path/upload- directory)
           const imageUploadPath = path.join(__dirname, `../public/products/${imageName}`)

              //move the folder
            await productImage.mv(imageUploadPath)

            //req.params(id), rq.body(updated data +pn,pp,pc,pd), req.files(image)
            //add new field to the req.body(productImage->imageName)
            req.body.productImage = imageName; //image uploaded (generated name)

            // if image is uploaded, and req.body is assigned
            if(req.body.productImage){
                //find the product
                const existingProduct = await productModel.findById(req.params.id)

                //Searching in the directory folder
                const oldImagePath = path.join(__dirname, `../public/products/${existingProduct.productImage}`)

                // delete from file system
                fs.unlinkSync(oldImagePath)
            }

            
        }
        //update the data
        const updateProduct = await productModel.findByIdAndUpdate(req.params.id, req.body,{new:true})
        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: updateProduct
        })



        

    }catch(error){
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error
        })
    
    }

}

const paginatonProducts = async (req, res) => {

    // results  page number
    const pageNo = req.query.page || 1;
    const limit = req.query.limit || 10;
  
    // Per page 2 products
    
  
    try{
      // Find all products,skip the products, limit the products
      const products = await productModel.find({})
      .skip((pageNo - 1) * limit)
      .limit(limit);
  
      // if page 6 is requested, result 0
      if(products.length === 0){
        return res.status(404).json({
          success: false,
          message: 'No products found',
        })
  
       
        
      }
  
      //response
      res.status(200).json({
        success: true,
        message: 'Products fetched successfully',
        products: products,
      })
  
      
  
  
    }catch(error){
      console.log(error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error,
      });
    }
  
  }





module.exports = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    deleteProduct,
    updateProduct,
    paginatonProducts,
};
