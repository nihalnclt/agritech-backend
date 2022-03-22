const mongoose = require('mongoose');

const Comment = require('./comment.model');

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        body: {
            type: String,
            required: true,
        },
        category: {
            type: mongoose.Types.ObjectId,
            ref: 'PostCategory',
            required: true,
        },
        thumbnail: {
            type: String,
            required: true,
        },
        youtubeLink: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

postSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'postId',
});

postSchema.virtual('numComments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'postId',
    count: true,
});

postSchema.pre('remove', async function (next) {
    const post = this;
    await Comment.deleteMany({ postId: post._id });
    next();
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
