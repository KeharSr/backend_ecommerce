const Favorite = require('../models/favouritesModel');

const addFavorite = async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.body;

    try {
        const favorite = await Favorite.findOne({ user: userId, product: productId });

        if (favorite) {
            return res.status(400).json({
                success: false,
                message: 'Product is already in favorites'
            });
        }

        const newFavorite = new Favorite({ user: userId, product: productId });
        await newFavorite.save();

        res.status(201).json({
            success: true,
            message: 'Product added to favorites',
            favorite: newFavorite
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

const removeFavorite = async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.body;

    try {
        const favorite = await Favorite.findOneAndDelete({ user: userId, product: productId });

        if (!favorite) {
            return res.status(404).json({
                success: false,
                message: 'Product not found in favorites'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Product removed from favorites'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

const getFavorites = async (req, res) => {
    const userId = req.user.id;

    try {
        const favorites = await Favorite.find({ user: userId }).populate('product');

        res.status(200).json({
            success: true,
            favorites: favorites.map(fav => fav.product)
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

module.exports = {
    addFavorite,
    removeFavorite,
    getFavorites
};
