const { sendErrorResponse } = require('../helpers');
const { Order, User, Product } = require('../models');

module.exports = {
    getAdminData: async (req, res) => {
        try {
            const oneDayOrder = await Order.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: new Date(
                                new Date().getTime() - 1 * 24 * 60 * 60 * 1000
                            ),
                        },
                    },
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$totalAmount' },
                    },
                },
            ]);

            const oneMonthOrder = await Order.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: new Date(
                                new Date().getTime() - 30 * 24 * 60 * 60 * 1000
                            ),
                        },
                    },
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$totalAmount' },
                    },
                },
            ]);

            const allTimeOrder = await Order.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$totalAmount' },
                    },
                },
            ]);

            const totalOrders = await Order.find({}).count();
            const totalUsers = await User.find({}).count();
            const totalProducts = await Product.find({}).count();
            const totalDeliveredOreders = await Order.find({
                orderStatus: 'delivered',
            }).count();

            const topSellingCategories = await Order.aggregate([
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
                        products: 1,
                        product: { $arrayElemAt: ['$product', 0] },
                    },
                },
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'product.category',
                        foreignField: '_id',
                        as: 'product.category',
                    },
                },
                {
                    $project: {
                        products: 1,
                        product: {
                            price: 1,
                            category: {
                                $arrayElemAt: ['$product.category', 0],
                            },
                        },
                    },
                },
                {
                    $group: {
                        _id: '$product.category.name',
                        total: {
                            $sum: {
                                $multiply: [
                                    '$product.price',
                                    '$products.quantity',
                                ],
                            },
                        },
                    },
                },
                {
                    $sort: { ordersCount: -1 },
                },
                {
                    $limit: 6,
                },
            ]);

            const topSellingProducts = await Order.aggregate([
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
                        products: 1,
                        product: { $arrayElemAt: ['$product', 0] },
                    },
                },
                {
                    $group: {
                        _id: '$product.name',
                        ordersCount: { $sum: '$products.quantity' },
                    },
                },
                {
                    $sort: { ordersCount: -1 },
                },
                {
                    $limit: 6,
                },
            ]);

            res.status(200).json({
                oneDayOrder: oneDayOrder[0],
                oneMonthOrder: oneMonthOrder[0],
                allTimeOrder: allTimeOrder[0],
                totalOrders,
                totalUsers,
                totalProducts,
                totalDeliveredOreders,
                topSellingProducts,
                topSellingCategories,
            });
        } catch (err) {
            sendErrorResponse(res, 500, err);
        }
    },
};
