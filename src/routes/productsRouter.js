const router = require('express').Router();

const {
    addProduct,
    deleteProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
} = require('../controllers/productsController');

router.post('', addProduct);
router.get('/', getAllProducts);
router.get('/:id', getSingleProduct);
router.patch('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
