const mongoose = require('mongoose');

const { Schema } = mongoose;

const orderSchema = new Schema(
    {
        userId: {
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
            lowercase: true,
            enum: ['ordered', 'packed', 'shipped', 'delivered'],
            default: 'ordered',
        },
        paymentType: {
            type: String,
            required: true,
            lowercase: true,
            enum: ['cod', 'card'],
        },
        razorpay: {
            razorpayPaymentId: {
                type: String,
            },
            razorpayOrderId: {
                type: String,
            },
            razorpaySignature: {
                type: String,
            },
        },
    },
    { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
