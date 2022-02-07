const mongoose = require('mongoose');

const { Schema } = mongoose;

const orderSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        products: [
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
        totalAmount: {
            type: Number,
            required: true,
        },
        address: {
            type: Schema.Types.ObjectId,
            ref: 'Address',
            required: true,
        },
        orderStatus: {
            type: String,
            enum: ['ordered', 'packed', 'shipped', 'delivered'],
            default: 'ordered',
        },
        paymentType: {
            type: String,
            enum: ['cod', 'card'],
            required: true,
        },
    },
    { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
