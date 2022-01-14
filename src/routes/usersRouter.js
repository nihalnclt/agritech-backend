const router = require('express').Router();

const { createUser, loginUser } = require('../controllers/userController');

router.post('', createUser);
router.post('/login', loginUser);

module.exports = router;
