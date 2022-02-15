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

            const eachMonthSales = await Order.aggregate([
                {
                    $group: {
                        _id: { $month: '$createdAt' },
                        total: { $sum: '$totalAmount' },
                        count: { $sum: 1 },
                    },
                },
            ]);

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
                    $lookup: {
                        from: 'categories',
                        localField: 'product.category',
                        foreignField: '_id',
                        as: 'category',
                    },
                },
                {
                    $project: {
                        category: { $arrayElemAt: ['$category', 0] },
                        products: 1,
                    },
                },
                {
                    $group: {
                        _id: '$category.name',
                        ordersCount: { $sum: '$products.quantity' },
                    },
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
                eachMonthSales,
                topSellingCategories,
            });
        } catch (err) {
            sendErrorResponse(res, 500, err);
        }
    },
};
