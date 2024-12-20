const express = require('express');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');
const { getAllUsers, updateUserRole, deleteUser, getUserById } = require('../controllers/userController');

const router = express.Router();

router.get('/', isAuthenticatedUser, authorizeRoles('admin'), getAllUsers);
router.get('/:id', isAuthenticatedUser, getUserById);
router.put('/:userId/:role', isAuthenticatedUser, authorizeRoles('admin'), updateUserRole);
router.delete('/:userId', isAuthenticatedUser, authorizeRoles('admin'), deleteUser);

module.exports = router;
