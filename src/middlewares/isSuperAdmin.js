const { sendErrorResponse } = require('../helpers');

const isSuperAdmin = (req, res, next) => {
    try {
        if (req.user.role !== 'super-admin') {
            return sendErrorResponse(res, 400, 'Super Admin access denied');
        }
        next();
    } catch (err) {
        sendErrorResponse(res, 500, err);
    }
};

module.exports = isSuperAdmin;