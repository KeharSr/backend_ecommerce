


const Review = require('../models/review&ratingModel');
const Product = require('../models/productModel');

const createReview = async (req, res) => {
    const { rating, review, productId } = req.body;
    const id = req.user.id; 
    console.log(id);

    try {
        // Check if the user has already posted a review for this product
        const existingReview = await Review.findOne({
            
            product: productId,
            user: id
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: "You have already reviewed this product"
            });
        }

        const newReview = await Review.create({
            rating: rating,
            review: review,
            product: productId,
            user: id
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

// get product ratings and reviews by user and product
const getReviewByUserAndProduct = async (req, res) => {
    const productId = req.params.id;
    const userId = req.user.id;

    try {
        const review = await Review.findOne({ product: productId, user: userId });

        if (review.length===0) {
            return res.status(404).json({
                success: false,
                message: 'No review found for this product'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Review fetched successfully',
            review: review
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching review", error: error.message });
    }
};

//Get all reviews for a product
const getReviewsByProduct = async (req, res) => {
    const productId = req.params.id;

    try {
        const reviews = await Review.find({ product: productId })

        if (reviews.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No reviews found for this product'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Reviews fetched successfully',
            reviews: reviews
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching reviews", error: error.message });
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


module.exports = { 
    createReview, 
    getReviewsByProduct,
    getReviewByUserAndProduct
};
