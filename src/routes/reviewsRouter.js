const router = require('express').Router();

const { addReview, getReviews } = require('../controllers/reviewsController');

router.post('', addReview);

module.exports = router;
