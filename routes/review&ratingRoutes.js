const express = require('express');
const router = express.Router();
const reviewandratingController = require('../controllers/review&ratingControllers');
const { authGuard, adminGuard } = require('../middleware/authGuard');

router.post('/post_reviews', authGuard, reviewandratingController.createReview);
router.get('/reviews/product/:productId', reviewandratingController.getReviewsByProduct);
router.get('/reviews/admin', authGuard, adminGuard, reviewandratingController.getReviewsForAdmin);

module.exports = router;
