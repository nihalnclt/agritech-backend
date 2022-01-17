const router = require('express').Router();

const {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
} = require('../controllers/usersController');

router.post('', createUser);
router.post('/login', loginUser);
router.patch('/', updateUser);
router.delete('/', deleteUser);

module.exports = router;
