const router = require('express').Router();
const productController = require('../controllers/productControllers');
const { authGuard, adminGuard } = require('../middleware/authGuard');


router.post('/create', productController.createProduct)

router.get('/get_all_products',authGuard, productController.getAllProducts,)

//delete product
router.delete('/delete_product/:id',productController.deleteProduct,adminGuard)

router.put('/update_product/:id',productController.updateProduct)

router.get('/get_single_product/:id',authGuard,productController.getSingleProduct,)

// pagination
router.get('/pagination', productController.paginatonProducts);



module.exports = router