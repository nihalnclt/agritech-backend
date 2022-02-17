const router = require('express').Router();

const { addAddress, getAddress } = require('../controllers/addressController');
const { auth } = require('../middlewares');

router.post('/', auth, addAddress);
router.get('/', auth, getAddress);

module.exports = router;
