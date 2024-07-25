const express = require('express');
const favoritesController = require('../controllers/favouritesControllers');
const {  authGuard } = require('../middleware/authGuard');
const router = express.Router();

router.post('/add', authGuard, favoritesController.addFavorite);
router.post('/remove', authGuard, favoritesController.removeFavorite);
router.get('/get', authGuard, favoritesController.getFavorites);

module.exports = router;
