const router = require('express').Router();
const productController = require('../controllers/productControllers')


router.post('/create', productController.createProduct)

router.get('/get_all_products', productController.getAllProducts,)

//delete product
router.delete('/delete_product/:id',productController.deleteProduct)

router.put('/update_product/:id',productController.updateProduct)



module.exports = router