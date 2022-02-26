const router = require('express').Router();

const {
    addCategory,
    updateCategory,
    deleteCategory,
    getAllCategories,
} = require('../controllers/categoriesController');
const { auth, isSuperAdmin } = require('../middlewares');

router.post('', auth, isSuperAdmin, addCategory);
router.get('', getAllCategories);
router.patch('/:id', auth, isSuperAdmin, updateCategory);
router.delete('/:id', auth, isSuperAdmin, deleteCategory);

module.exports = router;
