const router = require('express').Router();

const { createUser, loginUser } = require('../controllers/usersController');

router.post('', createUser);
router.post('/login', loginUser);

module.exports = router;
