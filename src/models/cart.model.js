const mongoose = require('mongoose');

const { Schema } = mongoose;

const cartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    cartItems: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                default: 1,
            },
        },
    ],
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
