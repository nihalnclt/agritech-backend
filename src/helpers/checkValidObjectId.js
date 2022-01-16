const ObjectId = require('mongoose').Types.ObjectId;

const checkValidObjectId = (id) => {
    return ObjectId.isValid(id);
};

module.exports = checkValidObjectId;
