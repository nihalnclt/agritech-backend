const { Review, Product } = require('../models');

const { sendErrorResponse, checkValidObjectId } = require('../helpers');

module.exports = {
    addReview: async (req, res) => {
        try {
            const { productId } = req.body;

            if (!productId) {
                return sendErrorResponse(res, 400, 'product id required');
            }

            if (!checkValidObjectId(productId)) {
                return sendErrorResponse(res, 400, 'Invalid product id');
            }

            const product = await Product.findById(productId);
            if (!product) {
                return sendErrorResponse(
                    res,
                    404,
                    'This product no longer exists'
                );
            }

            const newReview = new Review(req.body);
            await newReview.save();

            product.reviews.push(newReview._id);
            await product.save();

            res.status(201).json(newReview);
        } catch (err) {
            sendErrorResponse(res, 500, err);
        }
    },

    getReviews: async (req, res) => {
        try {
            const { productId } = req.params;

            if (!checkValidObjectId(productId)) {
                return sendErrorResponse(res, 400, 'Invalid product id');
            }

            const reviews = await Review.find({ productId: productId });
            res.status(200).json(reviews);
        } catch (err) {
            sendErrorResponse(res, 500, err);
        }
    },
};
