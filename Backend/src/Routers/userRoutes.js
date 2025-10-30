const express = require('express');
const router = express.Router();
const { Register,
    login,
    updateProfile,
    getProfile,
    changePassword,
    logout } = require('@/Controllers/AuthController');

const authMiddleware = require('@/Middlewares/authMiddleware');

router.post('/register', Register);
router.post('/login', login);
router.post('/logout', authMiddleware, logout);
router.get('/profile', authMiddleware, getProfile);
router.put('/update-profile', authMiddleware, updateProfile);
router.put('/change-password', authMiddleware, changePassword);

module.exports = router;



