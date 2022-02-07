const router = require('express').Router();

const {
    addReview,
    getAllReviews,
} = require('../controllers/reviewsController');
const { auth } = require('../middlewares');

router.post('', auth, addReview);
router.get('/:productId', getAllReviews);

module.exports = router;
