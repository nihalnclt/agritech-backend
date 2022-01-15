const mongoose = require('mongoose');

const { Schema } = mongoose;

const reviewSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        product: {
            type: Schema.Types.ObjectId,
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
            min: 0,
            max: 5,
        },
    },
    {
        timestamps: true,
    }
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
