const mongoose = require('mongoose');

const { Schema } = mongoose;

const commentSchema = new Schema(
    {
        comment: {
            type: String,
            required: true,
        },
        postId: {
            type: Schema.Types.ObjectId,
            ref: 'Post',
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
