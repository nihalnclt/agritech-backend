const router = require('express').Router();

const {
    addItemToCart,
    getCartItems,
    deleteCartItem,
    incrementProductQuantity,
    decrementProductQuantity,
    clearCart,
} = require('../controllers/cartController');
const { auth } = require('../middlewares');

router.post('', auth, addItemToCart);
router.get('', auth, getCartItems);
router.patch('/:productId', auth, deleteCartItem);
router.patch('/increment/:productId', auth, incrementProductQuantity);
router.patch('/decrement/:productId', auth, decrementProductQuantity);
router.delete('', auth, clearCart);

module.exports = router;
