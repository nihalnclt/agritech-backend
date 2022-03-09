const bcrypt = require('bcryptjs');

const { sendErrorResponse, checkValidObjectId } = require('../helpers');
const { User } = require('../models');

module.exports = {
    createUser: async (req, res) => {
        try {
            const newUser = new User({ ...req.body });
            await newUser.save();

            const token = await newUser.generateAuthToken();
            res.status(201).json({ user: newUser, token });
        } catch (err) {
            if (err.code === 11000) {
                return sendErrorResponse(res, 400, 'Email id already exists');
            }
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
                return sendErrorResponse(res, 400, 'Invalid email or password');
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return sendErrorResponse(res, 400, 'Invalid email or password');
            }

            const token = await user.generateAuthToken();
            user.token = token;
            await user.save();

            return res.status(200).json({ user, token });
        } catch (err) {
            sendErrorResponse(res, 500, err);
        }
    },

    // https://localhost:500/api/v1/users/all?search=nihal&skip=3
    getAllUsers: async (req, res) => {
        try {
            const filters = {};

            if (req.query.search && req.query.search !== '') {
                filters.fname = { $regex: req.query.search, $options: 'i' };
            }

            const usersPerPage = 12;
            const skip = parseInt(req.query.skip) || 0;

            const users = await User.find(filters)
                .limit(usersPerPage)
                .skip(usersPerPage * skip);

            const totalUsers = await User.find(filters).count();

            res.status(200).json({ users, skip, usersPerPage, totalUsers });
        } catch (err) {
            sendErrorResponse(res, 500, err);
        }
    },

    getUser: async (req, res) => {
        try {
            return res.status(200).json({ user: req.user, token: req.token });
        } catch (err) {
            sendErrorResponse(res, 500, err);
        }
    },

    updateUser: async (req, res) => {
        try {
            const updates = Object.keys(req.body);
            const allowedUpdates = ['fname', 'lname', 'email', 'avatar'];

            if (!updates.every((update) => allowedUpdates.includes(update))) {
                return sendErrorResponse(
                    res,
                    400,
                    `you can only update ${allowedUpdates}`
                );
            }

            updates.forEach((update) => {
                req.user[update] = req.body[update];
            });

            await req.user.save();
            res.status(200).json(req.user);
        } catch (err) {
            if (err.code === 11000) {
                return sendErrorResponse(res, 400, 'Email id already exists');
            }
            sendErrorResponse(res, 500, err);
        }
    },

    deleteOwnAccount: async (req, res) => {
        try {
            await req.user.remove();
            res.status(200).json({ message: 'user successfully deleted' });
        } catch (err) {
            sendErrorResponse(res, 500, err);
        }
    },

    deleteUser: async (req, res) => {
        try {
            const { id } = req.params;

            if (!checkValidObjectId(id)) {
                return sendErrorResponse(res, 400, 'Invalid object id');
            }

            const user = await User.findByIdAndRemove(id);

            if (!user) {
                return sendErrorResponse(res, 404, 'User not found');
            }

            res.status(200).json({ message: 'user deleted successfully' });
        } catch (err) {
            sendErrorResponse(res, 500, err);
        }
    },

    loginAsAdmin: async (req, res) => {
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
                return sendErrorResponse(res, 400, 'Invalid email or password');
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return sendErrorResponse(res, 400, 'Invalid email or password');
            }

            if (user.role !== 'admin') {
                return sendErrorResponse(res, 400, 'Admin access denied!.');
            }

            const token = await user.generateAuthToken();
            user.token = token;
            await user.save();

            return res.status(200).json({ user, token });
        } catch (err) {
            sendErrorResponse(res, 500, err);
        }
    },

    updateRole: async (req, res) => {
        try {
            await User.findOneAndUpdate(
                { _id: req.params.id },
                { role: req.body?.role || 'user' }
            );

            res.status(200).json({ message: 'user role updated successfully' });
        } catch (err) {
            sendErrorResponse(res, 500, err);
        }
    },
};
