
const { authGuard, adminGuard } = require('../middleware/authGuard');

const cartController = require('../controllers/cartControllers');

const router = require('express').Router();

// Add a product to the cart
router.post('/add_to_cart',authGuard,cartController.addToCart);

// Remove a product from the cart
router.delete('/remove_from_cart/:id', authGuard, cartController.removeFromCart);

// Get the cart
router.get('/get_cart', authGuard, cartController.getCart);

module.exports = router;