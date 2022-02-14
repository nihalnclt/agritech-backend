const router = require('express').Router();

const { auth, isAdmin } = require('../middlewares');
const {
    addPost,
    getAllPosts,
    getSinglePost,
    deletePost,
    updatePost,
} = require('../controllers/postsController');

router.post('/', auth, isAdmin, addPost);
router.get('/', getAllPosts);
router.get('/:id', getSinglePost);
router.delete('/:id', auth, isAdmin, deletePost);
router.patch('/:id', auth, isAdmin, updatePost);

module.exports = router;
