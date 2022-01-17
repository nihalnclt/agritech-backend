const ObjectId = require('mongoose').Types.ObjectId;

const { sendErrorResponse, checkValidObjectId } = require('../helpers');
const { Product, Category } = require('../models');

module.exports = {
    addProduct: async (req, res) => {
        try {
            const newProduct = new Product(req.body);
            await newProduct
                .save()
                .then((response) => {
                    res.status(201).json(response);
                })
                .catch((err) => {
                    sendErrorResponse(res, 400, err);
                });
        } catch (err) {
            sendErrorResponse(res, 500, err);
        }
    },

    // - /products?skip=3&limit=10&sort=price:desc&category=fruits&maxprice=1000
    getAllProducts: async (req, res) => {
        try {
            const sort = {};
            const filters = {};

            // &sort=price:desc
            // &sort=name:desc
            if (req.query.sort) {
                const parts = req.query.sort.split(':');
                sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
            }

            // &category=categoryname
            if (req.query.category) {
                const category = await Category.findOne({
                    name: req.query.category,
                });

                if (!category) {
                    return sendErrorResponse(res, 404, 'No Products found');
                }

                filters.category = category._id;
            }

            // &maxprice=price
            if (req.query.maxprice) {
                if (!Boolean(parseInt(req.query.maxprice))) {
                    return sendErrorResponse(res, 404, 'No Products found');
                }

                filters.price = { $lt: parseInt(req.query.maxprice) };
            }

            const perPage = parseInt(req.query.limit) || 12;
            const skip = parseInt(req.query.skip) || 0;

            const aggregateQuery = [
                {
                    $match: filters,
                },
                {
                    $lookup: {
                        from: 'reviews',
                        localField: '_id',
                        foreignField: 'productId',
                        as: 'review',
                    },
                },
                {
                    $project: {
                        name: 1,
                        thumbnail: 1,
                        price: 1,
                        avgStars: { $avg: '$review.stars' },
                    },
                },
                {
                    $skip: perPage * skip,
                },
                {
                    $limit: perPage,
                },
            ];

            if (Object.keys(sort).length !== 0) {
                aggregateQuery.push({ $sort: sort });
            }

            const products = await Product.aggregate(aggregateQuery);

            if (products.length < 1) {
                return sendErrorResponse(res, 404, 'No Products found');
            }

            const count = await Product.find(filters).sort(sort).count();

            res.status(200).json({
                products,
                totalProducts: count,
                limit: perPage,
                skip: skip,
            });
        } catch (err) {
            sendErrorResponse(res, 500, err);
        }
    },

    getSingleProduct: async (req, res) => {
        try {
            const { id } = req.params;

            if (!checkValidObjectId(id)) {
                return sendErrorResponse(res, 400, 'Invalid object id');
            }

            // const product = await Product.findById(id).populate('category');
            const product = await Product.aggregate([
                {
                    $match: {
                        _id: ObjectId(id),
                    },
                },
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'category',
                        foreignField: '_id',
                        as: 'category',
                    },
                },
                {
                    $lookup: {
                        from: 'reviews',
                        localField: '_id',
                        foreignField: 'productId',
                        as: 'reviews',
                    },
                },
                {
                    $project: {
                        name: 1,
                        thumbnail: 1,
                        shortDescription: 1,
                        stock: 1,
                        unit: 1,
                        description: 1,
                        price: 1,
                        category: { $arrayElemAt: ['$category', 0] },
                        imagesPath: 1,
                        reviews: 1,
                        totalReviews: { $size: '$reviews' },
                        avgStars: { $avg: '$reviews.stars' },
                    },
                },
            ]);

            if (product.length < 1) {
                return sendErrorResponse(res, 404, 'No products found');
            }

            res.status(200).json(product[0]);
        } catch (err) {
            sendErrorResponse(res, 500, err);
        }
    },

    updateProduct: async (req, res) => {
        try {
            const { id } = req.params;

            if (!checkValidObjectId(id)) {
                return sendErrorResponse(res, 400, 'Invalid object id');
            }

            const product = await Product.findByIdAndUpdate(id, req.body);

            if (!product) {
                return sendErrorResponse(res, 404, 'No products found');
            }

            res.status(200).json({ message: 'product updated suucessfully' });
        } catch (err) {
            sendErrorResponse(res, 500, err);
        }
    },

    deleteProduct: async (req, res) => {
        try {
            const { id } = req.params;

            if (!checkValidObjectId(id)) {
                return sendErrorResponse(res, 400, 'Invalid object id');
            }

            const product = await Product.findOne({ _id: id });

            if (!product) {
                return sendErrorResponse(res, 404, 'No products found');
            }

            await product.remove();

            res.status(200).json({ message: 'product successfully deleted' });
        } catch (err) {
            sendErrorResponse(res, 500, err);
        }
    },
};
