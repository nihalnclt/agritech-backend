const bcrypt = require('bcryptjs');

const { sendErrorResponse } = require('../helpers');
const { User } = require('../models');

module.exports = {
    createUser: async (req, res) => {
        try {
            const newUser = new User(req.body);
            const token = await newUser.generateAuthToken();
            newUser.token = token;
            await newUser
                .save()
                .then((response) => {
                    res.status(201).json({ user: response, token });
                })
                .catch((err) => {
                    // handling same email address error
                    if (err.code === 11000) {
                        return sendErrorResponse(
                            res,
                            400,
                            'Email id already exists'
                        );
                    }
                    sendErrorResponse(res, 400, err);
                });
        } catch (err) {
            sendErrorResponse(res, 500, err);
        }
    },

    loginUser: async (req, res) => {
        try {
            if (!req.body.email || !req.body.password) {
                return sendErrorResponse(
                    res,
                    400,
                    'Email id and password is required'
                );
            }

            const { email, password } = req.body;

            const user = await User.findOne({ email: email });
            if (!user) {
                return sendErrorResponse(res, 404, 'Invalid email or password');
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return sendErrorResponse(res, 404, 'Invalid email or password');
            }

            const token = await user.generateAuthToken();
            user.token = token;
            await user.save();

            return res.status(200).json({ user, token });
        } catch (err) {
            sendErrorResponse(res, 500, err);
        }
    },

    updateUser: async (req, res) => {
        try {
        } catch (err) {
            sendErrorResponse(res, 500, err);
        }
    },

    deleteUser: async (req, res) => {
        try {
        } catch (err) {
            sendErrorResponse(res, 500, err);
        }
    },
};
