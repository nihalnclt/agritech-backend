const router = require('express').Router();

const {
    addCategory,
    updateCategory,
    deleteCategory,
    getAllCategories,
} = require('../controllers/categoriesController');
const { auth, isAdmin } = require('../middlewares');

router.post('', auth, isAdmin, addCategory);
router.get('', getAllCategories);
router.patch('/:id', auth, isAdmin, updateCategory);
router.delete('/:id', auth, isAdmin, deleteCategory);

module.exports = router;
