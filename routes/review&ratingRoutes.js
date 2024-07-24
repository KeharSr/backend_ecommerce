const express = require('express');
const router = express.Router();
const reviewandratingController = require('../controllers/review&ratingControllers');
const { authGuard, adminGuard } = require('../middleware/authGuard');

//post reviews
router.post('/post_reviews', authGuard, reviewandratingController.createReview);

//get reviews
router.get('/get_reviews/:id',authGuard, reviewandratingController.getReviewsByProduct);

//get reviews by user and product
router.get('/get_reviews_by_user_and_product/:id', authGuard, reviewandratingController.getReviewByUserAndProduct);

module.exports = router;
