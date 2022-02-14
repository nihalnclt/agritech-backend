const { sendErrorResponse } = require('../helpers');
const Comment = require('../models/comment.model');

module.exports = {
    addComment: (req, res) => {
        try {
            const newComment = new Comment({
                ...req.body,
                userId: req.user._id,
            });
            newComment
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
};
