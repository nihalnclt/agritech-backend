const { sendErrorResponse } = require('../helpers');
const { Product } = require('../models');

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

    deleteProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const product = await Product.findOneAndRemove({ _id: id });

            if (!product) {
                return sendErrorResponse(res, 404, 'No products found');
            }

            res.status(200).json({ message: 'product successfully deleted' });
        } catch (err) {
            sendErrorResponse(res, 500, err);
        }
    },
};
