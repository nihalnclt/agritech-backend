const router = require('express').Router();

const { addCategory } = require('../controllers/CategoriesController');

router.post('', addCategory);

module.exports = router;
