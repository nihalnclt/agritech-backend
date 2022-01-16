const mongoose = require('mongoose');

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
        trim: true,
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
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectID,
            ref: 'Review',
        },
    ],
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
