const { sendErrorResponse, checkValidObjectId } = require('../helpers');
const { PostCategory } = require('../models');
const Post = require('../models/post.model');

module.exports = {
    addPost: async (req, res) => {
        try {
            const newPost = new Post(req.body);
            newPost
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

    getAllPosts: async (req, res) => {
        try {
            const { category } = req.query;
            const limit = req.query.limit || 12;

            const skip = parseInt(req.query.skip) || 0;

            const filters = {};

            if (category && category !== '') {
                const myCategory = await PostCategory.findOne({
                    name: category,
                });
                if (!myCategory) {
                    return res
                        .status(200)
                        .json({ posts: [], skip: 0, limit: 0, totalPosts: 0 });
                }
                filters.category = myCategory._id;
            }

            let posts = await Post.find(filters)
                .lean()
                .populate('category')
                .populate('numComments')
                .limit(limit)
                .skip(skip ? limit * skip : 0);

            const totalPosts = await Post.find(filters).count();

            posts = posts.map((post) => {
                return {
                    ...post,
                    body: post.body
                        .replace(/<\/?[^>]+(>|$)/g, '')
                        .trim()
                        .slice(0, 130),
                };
            });

            res.status(200).json({ posts, skip, limit, totalPosts });
        } catch (err) {
            sendErrorResponse(res, 500, err);
        }
    },

    getSinglePost: async (req, res) => {
        try {
            if (!checkValidObjectId(req.params.id)) {
                return sendErrorResponse(res, 400, 'Invalid object id');
            }

            const post = await Post.findOne({ _id: req.params.id })
                .populate('category')
                .populate({ path: 'comments' })
                .exec();

            if (!post) {
                return sendErrorResponse(res, 404, 'No posts found');
            }

            const nextPost = await Post.findOne({
                _id: { $gt: req.params.id },
            }).select('title');

            const prevPost = await Post.findOne({
                _id: { $lt: req.params.id },
            }).select('title');

            res.status(200).json({
                post,
                comments: post.comments,
                nextPost,
                prevPost,
            });
        } catch (err) {
            sendErrorResponse(res, 500, err);
        }
    },

    deletePost: async (req, res) => {
        try {
            if (!checkValidObjectId(req.params.id)) {
                return sendErrorResponse(res, 400, 'Invalid object id');
            }

            const post = await Post.findOne({ _id: req.params.id });
            if (!post) {
                return sendErrorResponse(res, 404, 'No post found');
            }
            await post.remove();

            res.status(200).json({ message: 'post deleted successfully' });
        } catch (err) {
            sendErrorResponse(res, 400, err);
        }
    },

    updatePost: async (req, res) => {
        const updates = Object.keys(req.body);
        const allowedUpdates = [
            'title',
            'category',
            'thumbnail',
            'description',
            'body',
        ];
        if (!updates.every((update) => allowedUpdates.includes(update))) {
            return sendErrorResponse(
                res,
                400,
                `You can only update ${allowedUpdates}`
            );
        }
        try {
            const post = await Post.findOne({
                _id: req.params.id,
            });
            if (!post) {
                return res.status(404).send({ message: 'No post found' });
            }
            updates.forEach((update) => (post[update] = req.body[update]));
            await post.save();
            res.status(200).json(post);
        } catch (err) {
            sendErrorResponse(res, 500, err);
        }
    },
};
