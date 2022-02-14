const router = require('express').Router();

const { addAddress } = require('../controllers/addressController');
const { auth } = require('../middlewares');

router.post('/', auth, addAddress);

module.exports = router;
