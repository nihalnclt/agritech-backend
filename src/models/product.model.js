const mongoose = require('mongoose');
const Review = require('./review.model');

const { Schema } = mongoose;

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    shortDescription: {
        type: String,
        required: true,
        trim: true,
    },
    thumbnail: {
        type: String,
        required: true,
        trim: true,
    },
    stock: {
        type: Number,
        required: true,
        trim: true,
    },
    unit: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
    },
    imagesPath: [
        {
            type: String,
        },
    ],
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

// deleting reviews that is related to removed product
productSchema.pre('remove', async function (next) {
    try {
        const product = this;
        await Review.deleteMany({ productId: product._id });
        next();
    } catch (err) {
        next(new Error(err));
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
