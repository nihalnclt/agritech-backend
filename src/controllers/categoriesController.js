const { Category } = require('../models');
const { sendErrorResponse, checkValidObjectId } = require('../helpers');

module.exports = {
    addCategory: async (req, res) => {
        try {
            const newCategory = new Category(req.body);
            await newCategory
                .save()
                .then((response) => {
                    res.status(201).json(response);
                })
                .catch((err) => {
                    if (err.code === 11000) {
                        return sendErrorResponse(
                            res,
                            400,
                            `The category ${req.body.name} is already exists!`
                        );
                    }
                    sendErrorResponse(res, 400, err);
                });
        } catch (err) {
            sendErrorResponse(res, 500, err);
        }
    },

    updateCategory: async (req, res) => {
        try {
            const { id } = req.params;
            if (!checkValidObjectId(id)) {
                return sendErrorResponse(res, 400, 'Invalid object id');
            }

            const category = await Category.findByIdAndUpdate(id, req.body, {
                new: true,
            });

            if (!category) {
                return sendErrorResponse(res, 404, 'No category found');
            }

            res.status(200).json(category);
        } catch (err) {
            if (err.code === 11000) {
                return sendErrorResponse(
                    res,
                    400,
                    `The category ${req.body.name} is already exists!`
                );
            }
            sendErrorResponse(res, 500, err);
        }
    },

    deleteCategory: async (req, res) => {
        try {
            const { id } = req.params;
            if (!checkValidObjectId(id)) {
                return sendErrorResponse(res, 400, 'Invalid object id');
            }

            const category = await Category.findByIdAndRemove(id);

            if (!category) {
                return sendErrorResponse(res, 404, 'No category found');
            }

            res.status(200).json({ message: 'Category deleted successfully' });
        } catch (err) {
            sendErrorResponse(res, 500, err);
        }
    },

    getAllCategories: async (req, res) => {
        try {
            const filters = {};
            const { search } = req.query;

            if (search && search !== '') {
                filters.name = { $regex: search, $options: 'i' };
            }

            const categories = await Category.aggregate([
                {
                    $match: filters,
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: '_id',
                        foreignField: 'category',
                        as: 'products',
                    },
                },
                {
                    $project: {
                        name: 1,
                        icon: 1,
                        count: { $size: '$products' },
                    },
                },
                {
                    $sort: { count: -1 },
                },
            ]);
            res.status(200).json(categories);
        } catch (err) {
            sendErrorResponse(res, 500, err);
        }
    },
};
