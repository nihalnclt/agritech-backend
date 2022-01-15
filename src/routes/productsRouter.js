const router = require('express').Router();

const {
    addProduct,
    deleteProduct,
} = require('../controllers/productsController');

router.post('', addProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
