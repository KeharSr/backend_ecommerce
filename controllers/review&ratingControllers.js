


const Review = require('../models/review&ratingModel');
const Product = require('../models/productModel');

const createReview = async (req, res) => {
    const { rating, review, productId } = req.body;
    const userId = req.user.id; // Assuming user is authenticated and user ID is attached to req.user

    try {
        // Check if the user has already posted a review for this product
        const existingReview = await Review.findOne({
            user: userId,
            product: productId
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: "You have already reviewed this product"
            });
        }

        const newReview = await Review.create({
            rating,
            review,
            product: productId,
            user: userId
        });

        // Update product ratings after adding new review
        await updateProductRatings(productId);

        res.status(201).json({
            success: true,
            message: "Review added successfully",
            review: newReview
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error adding review", error: error.message });
    }
};

const updateProductRatings = async (productId) => {
    const reviews = await Review.find({ product: productId });
    const numRatings = reviews.length;
    const ratingsAverage = reviews.reduce((acc, cur) => acc + cur.rating, 0) / numRatings;

    await Product.findByIdAndUpdate(productId, {
        ratingsAverage,
        ratingsQuantity: numRatings
    });
};

const getReviewsByProduct = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name');
        res.json(reviews);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const getReviewsForAdmin = async (req, res) => {
    try {
        const reviews = await Review.find().populate('product').populate('user', 'name');
        res.json(reviews);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = { createReview, getReviewsByProduct, getReviewsForAdmin };
