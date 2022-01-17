const router = require('express').Router();

const {
    addProduct,
    deleteProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
} = require('../controllers/productsController');
const { userAuth } = require('../middlewares');

router.post('', addProduct);
router.get('/', getAllProducts);
router.get('/:id', userAuth, getSingleProduct);
router.patch('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
