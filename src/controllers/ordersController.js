const Razorpay = require('razorpay');

const { sendErrorResponse } = require('../helpers');
const { Order, Cart, Address } = require('../models');

const instance = new Razorpay({
    key_id: 'rzp_test_wRs1QW9pU0kcUb',
    key_secret: 'b5EAobCLbhyi6wpOOA2HNGzV',
});

module.exports = {
    createOrder: async (req, res) => {
        try {
            const products = await Cart.findOne({
                user: req.user._id,
            });
            if (!products) {
                return sendErrorResponse(res, 400, 'Your cart is empty');
            }

            const address = await Address.findOne({ _id: req.body.address });
            if (!address) {
                return sendErrorResponse(res, 400, 'Address must be provided!');
            }

            if (req.body.paymentType === 'card') {
                const options = {
                    amount: Number(req.body.totalAmount) * 100,
                    currency: 'INR',
                };
                const order = await instance.orders.create(options);
                return res.status(200).json(order);
            }

            const newOrder = new Order({
                ...req.body,
                userId: req.user._id,
                products: products.cartItems,
            });

            await newOrder.save();
            await Cart.findOneAndRemove({ user: req.user._id });
            res.status(200).json(newOrder);
        } catch (err) {
            console.log(err);
            sendErrorResponse(res, 500, err);
        }
    },

    payOrder: async (req, res) => {
        try {
            const { razorpayPaymentId, razorpayOrderId, razorpaySignature } =
                req.body;

            const products = await Cart.findOne({
                user: req.user._id,
            });
            if (!products) {
                return sendErrorResponse(res, 400, 'Your cart is empty');
            }

            const newOrder = new Order({
                ...req.body,
                userId: req.user._id,
                products: products.cartItems,
                razorpay: {
                    razorpayPaymentId,
                    razorpayOrderId,
                    razorpaySignature,
                },
            });
            await newOrder.save();
            await Cart.findOneAndRemove({ user: req.user._id });
            res.status(200).json(newOrder);
        } catch (err) {
            console.log(err);
            sendErrorResponse(res, 500, err);
        }
    },

    updateStatus: async (req, res) => {
        try {
            const order = await Order.findOneAndUpdate(
                { _id: req.params.id },
                { orderStatus: req.body.orderStatus },
                { new: true, runValidators: true }
            );
            console.log(req.body.orderStatus);
            if (!order) {
                return sendErrorResponse(res, 400, 'order not found');
            }
            res.status(200).json({ message: 'order status updated' });
        } catch (err) {
            sendErrorResponse(res, 500, err);
        }
    },

    getAllOrders: async (req, res) => {
        try {
            const limit = 12;
            const { status, createdAt, paymentType } = req.query;
            const skip = parseInt(req.query.skip) || 0;

            const filters = {};

            if (status && status !== 'all') {
                filters.orderStatus = status;
            }

            if (createdAt && createdAt !== 'all') {
                filters.createdAt = {
                    $gte: new Date(
                        new Date().getTime() -
                            Number(createdAt) * 24 * 60 * 60 * 1000
                    ).toISOString(),
                };
            }

            if (paymentType && paymentType !== 'all') {
                filters.paymentType = paymentType;
            }

            // getting specific creator orders
            if (req.user.role === 'admin') {
                const orders = await Order.aggregate([
                    {
                        $unwind: '$products',
                    },
                    {
                        $lookup: {
                            from: 'products',
                            localField: 'products.productId',
                            foreignField: '_id',
                            as: 'product',
                        },
                    },
                    {
                        $project: {
                            product: { $arrayElemAt: ['$product', 0] },
                            paymentType: 1,
                            totalAmount: 1,
                            orderStatus: 1,
                            createdAt: 1,
                            address: 1,
                        },
                    },
                    {
                        $match: {
                            'product.creator': req.user._id,
                        },
                    },
                    {
                        $lookup: {
                            from: 'addresses',
                            localField: 'address',
                            foreignField: '_id',
                            as: 'address',
                        },
                    },
                    {
                        $project: {
                            address: { $arrayElemAt: ['$address', 0] },
                            paymentType: 1,
                            totalAmount: 1,
                            orderStatus: 1,
                            createdAt: 1,
                        },
                    },
                    {
                        $project: {
                            address: { phone: 1, city: 1 },
                            paymentType: 1,
                            totalAmount: 1,
                            orderStatus: 1,
                            createdAt: 1,
                        },
                    },
                ]);
                return res.status(200).json({ orders });
            }

            // getting all orders
            const orders = await Order.find(filters)
                .populate('address', 'phone city')
                .select({
                    paymentType: 1,
                    totalAmount: 1,
                    orderStatus: 1,
                    createdAt: 1,
                    address: 1,
                })
                .limit(limit)
                .skip(skip ? limit * skip : 0)
                .sort({ _id: -1 });

            const totalOrders = await Order.find(filters).count();

            res.status(200).json({ orders, totalOrders, skip, limit });
        } catch (err) {
            sendErrorResponse(res, 500, err);
        }
    },

    getAllOrdersByUser: async (req, res) => {
        try {
            const orders = await Order.find({ userId: req.params.id })
                .populate('address', 'phone city')
                .select({
                    paymentType: 1,
                    totalAmount: 1,
                    orderStatus: 1,
                    createdAt: 1,
                    address: 1,
                })
                .sort({ _id: -1 });

            res.status(200).json(orders);
        } catch (err) {
            sendErrorResponse(res, 500, err);
        }
    },

    getMyOrders: async (req, res) => {
        try {
            const orders = await Order.find({ userId: req.user._id }).select({
                paymentType: 1,
                totalAmount: 1,
                orderStatus: 1,
                createdAt: 1,
            });
            res.status(200).json(orders);
        } catch (err) {
            sendErrorResponse(res, 500, err);
        }
    },

    getSingleOrder: async (req, res) => {
        try {
            const order = await Order.findOne({ _id: req.params.id })
                .populate('address')
                .populate('products.productId', 'name price');
            res.status(200).json(order);
        } catch (err) {
            sendErrorResponse(res, 500, err);
        }
    },
};
