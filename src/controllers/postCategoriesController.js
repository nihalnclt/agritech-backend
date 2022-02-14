const { PostCategory } = require('../models');
const { sendErrorResponse, checkValidObjectId } = require('../helpers');

module.exports = {
    addCategory: async (req, res) => {
        try {
            const newCategory = new PostCategory(req.body);
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

            const category = await PostCategory.findByIdAndUpdate(id, req.body, {
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

            const category = await PostCategory.findByIdAndRemove(id);

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
            const categories = await PostCategory.aggregate([
                {
                    $lookup: {
                        from: 'posts',
                        localField: '_id',
                        foreignField: 'category',
                        as: 'posts',
                    },
                },
                {
                    $project: {
                        name: 1,
                        icon: 1,
                        count: { $size: '$posts' },
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
