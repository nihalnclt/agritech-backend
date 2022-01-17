const router = require('express').Router();

const {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUsers,
} = require('../controllers/usersController');
const { auth } = require('../middlewares');

router.get('', getAllUsers);
router.post('', createUser);
router.post('/login', loginUser);
router.patch('/', auth, updateUser);
router.delete('/', auth, deleteUser);

module.exports = router;
