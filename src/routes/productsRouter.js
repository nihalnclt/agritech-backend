const router = require('express').Router();

const {
    addProduct,
    deleteProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
} = require('../controllers/productsController');
const { isAdmin, auth } = require('../middlewares');

router.post('', addProduct);
router.get('/', getAllProducts);
router.get('/:id', auth, isAdmin, getSingleProduct);
router.patch('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
