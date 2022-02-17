const { sendErrorResponse } = require('../helpers');
const { Address } = require('../models');

module.exports = {
    addAddress: async (req, res) => {
        try {
            const address = await Address.findOne({ userId: req.user._id });
            if (!address) {
                const newAddress = new Address({
                    ...req.body,
                    userId: req.user._id,
                });
                await newAddress.save();
                return res.status(201).json(newAddress);
            } else {
                if (req.body?.userId || req.body?._id) {
                    return sendErrorResponse(
                        res,
                        400,
                        "userId and _id can't be changed!"
                    );
                }
                const response = await Address.findOneAndUpdate(
                    {
                        userId: req.user._id,
                    },
                    req.body,
                    { new: true, runValidators: true }
                );
                return res.status(200).json(response);
            }
        } catch (err) {
            sendErrorResponse(res, 500, err);
        }
    },

    getAddress: async (req, res) => {
        try {
            const address = await Address.findOne({ userId: req.user._id });
            res.status(200).send(address);
        } catch (err) {
            sendErrorResponse(res, 500, err);
        }
    },
};
