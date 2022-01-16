const router = require('express').Router();

const { addReview, getReviews } = require('../controllers/reviewsController');

router.post('', addReview);
router.get('/:productId', getReviews);

module.exports = router;
