const router = require('express').Router();

const {
    createUser,
    loginUser,
    updateUser,
    deleteOwnAccount,
    getAllUsers,
    deleteUser,
    getUser,
    loginAsAdmin,
    updateRole,
    sendEmailAddress,
    changePassword,
} = require('../controllers/usersController');
const { auth, isSuperAdmin } = require('../middlewares');

router.get('', auth, getUser);
router.get('/all', auth, isSuperAdmin, getAllUsers);
router.post('', createUser);
router.post('/login', loginUser);
router.post('/admin-login', loginAsAdmin);
router.post('/send-email', sendEmailAddress);
router.post('/change-password', changePassword);
router.patch('/', auth, updateUser);
router.patch('/:id', auth, isSuperAdmin, updateRole);
router.delete('/', auth, deleteOwnAccount);
router.delete('/:id', auth, isSuperAdmin, deleteUser);

module.exports = router;
