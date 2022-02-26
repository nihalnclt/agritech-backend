const { sendErrorResponse } = require('../helpers');

const isAdmin = (req, res, next) => {
    try {
        if (req.user.role !== 'admin' && req.user.role !== 'super-admin') {
            return sendErrorResponse(res, 400, 'Admin access denied');
        }
        next();
    } catch (err) {
        sendErrorResponse(res, 500, err);
    }
};

module.exports = isAdmin;
