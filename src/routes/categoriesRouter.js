const router = require('express').Router();

const {
    addCategory,
    updateCategory,
    deleteCategory,
} = require('../controllers/CategoriesController');

router.post('', addCategory);
router.patch('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
