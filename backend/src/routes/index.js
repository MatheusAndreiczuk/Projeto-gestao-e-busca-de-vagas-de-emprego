const express = require('express');

const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const userRoutes = require('./userRoutes');

const router = express.Router();

router.post('/login', authController.login);
router.post('/logout', authMiddleware, authController.logout);

router.use('/users', userRoutes);

module.exports = router;