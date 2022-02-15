const router = require('express').Router();

const { getAdminData } = require('../controllers/adminController');
const { auth, isAdmin } = require('../middlewares');

router.get('/', auth, isAdmin, getAdminData);

module.exports = router;
