const router = require('express').Router();

const {
    addProduct,
    deleteProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
} = require('../controllers/productsController');
const { isAdmin, auth } = require('../middlewares');

router.post('', auth, isAdmin, addProduct);
router.get('/', getAllProducts);
router.get('/:id', getSingleProduct);
router.patch('/:id', auth, isAdmin, updateProduct);
router.delete('/:id', auth, isAdmin, deleteProduct);

module.exports = router;
