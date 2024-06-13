const router = require('express').Router();
const productController = require('../controllers/productControllers')


router.post('/create', productController.createProduct)

router.get('/get_all_products', productController.getAllProducts)



module.exports = router