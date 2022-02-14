const router = require('express').Router();

const { addComment } = require('../controllers/commentsController');
const { auth } = require('../middlewares');

router.post('/', auth, addComment);

module.exports = router;
