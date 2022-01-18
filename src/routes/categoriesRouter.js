const router = require('express').Router();

const {
    addCategory,
    updateCategory,
    deleteCategory,
    getAllCategories,
} = require('../controllers/categoriesController');

router.post('', addCategory);
router.get('', getAllCategories);
router.patch('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
