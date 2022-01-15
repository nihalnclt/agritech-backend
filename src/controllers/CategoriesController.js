const { Category } = require('../models');
const { sendErrorResponse } = require('../helpers');

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

    deleteCategory: (req, res) => {},
};
