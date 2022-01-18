const router = require('express').Router();

const {
    createUser,
    loginUser,
    updateUser,
    deleteOwnAccount,
    getAllUsers,
    deleteUser,
} = require('../controllers/usersController');
const { auth } = require('../middlewares');

router.get('', getAllUsers);
router.post('', createUser);
router.post('/login', loginUser);
router.patch('/', auth, updateUser);
router.delete('/', auth, deleteOwnAccount);
router.delete('/:id', deleteUser);

module.exports = router;
