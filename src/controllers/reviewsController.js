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

            const newReview = new Review({ ...req.body, userId: req.user._id });
            await newReview.save();

            res.status(201).json(newReview);
        } catch (err) {
            sendErrorResponse(res, 500, err);
        }
    },

    getAllReviews: async (req, res) => {
        try {
            const reviews = await Review.find({
                productId: req.params.productId,
            }).populate('userId');

            res.status(200).json(reviews);
        } catch (err) {
            sendErrorResponse(res, 500, err);
        }
    },
};
