const router = require('express').Router();
const productController = require('../controllers/productControllers')


router.post('/create', productController.createProduct)

router.get('/all', productController.getAllProducts)

module.exports = router