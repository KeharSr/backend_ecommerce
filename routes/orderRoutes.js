const router = require('express').Router();

const orderController = require('../controllers/orderControllers');

const { authGuard, adminGuard } = require('../middleware/authGuard');

// Place an order
router.post('/place_order', authGuard, orderController.placeOrder);

// Verify an order


module.exports = router;