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
            const { skip, category } = req.query;
            const limit = 12;

            const filters = {};

            if (category && category !== '') {
                const myCategory = await PostCategory.findOne({
                    name: category,
                });
                if (!myCategory) {
                    return res.status(200).json([]);
                }
                filters.category = myCategory._id;
            }

            const posts = await Post.find(filters)
                .lean()
                .populate('category')
                .populate('numComments')
                .limit(limit)
                .skip(skip ? limit * skip : 0)
                .select({ body: 0 });

            res.status(200).json(posts);
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
            res.status(200).json({ post, comments: post.comments });
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
