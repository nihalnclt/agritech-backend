const router = require('express').Router();

const {
    addProduct,
    deleteProduct,
    getAllProducts,
    getSingleProduct,
} = require('../controllers/productsController');

router.post('', addProduct);
router.get('/', getAllProducts);
router.get('/:id', getSingleProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
