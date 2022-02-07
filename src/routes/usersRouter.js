const router = require('express').Router();

const {
    createUser,
    loginUser,
    updateUser,
    deleteOwnAccount,
    getAllUsers,
    deleteUser,
    getUser,
} = require('../controllers/usersController');
const { auth, isAdmin } = require('../middlewares');

router.get('', auth, getUser);
router.get('/all', auth, isAdmin, getAllUsers);
router.post('', createUser);
router.post('/login', loginUser);
router.patch('/', auth, updateUser);
router.delete('/', auth, deleteOwnAccount);
router.delete('/:id', auth, isAdmin, deleteUser);

module.exports = router;
