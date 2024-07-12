const router = require('express').Router();

const orderController = require('../controllers/orderControllers');

const { authGuard, adminGuard } = require('../middleware/authGuard');

// Place an order
router.post('/place_order', authGuard, orderController.placeOrder);

module.exports = router;