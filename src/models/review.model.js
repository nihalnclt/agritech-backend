const mongoose = require('mongoose');

const { Schema } = mongoose;

const reviewSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        productId: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'Product',
        },
        feedback: {
            type: String,
            required: true,
            trim: true,
        },
        stars: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
    },
    {
        timestamps: true,
    }
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
