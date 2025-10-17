const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validateUserCreation, validateUserUpdate } = require('../validators/userValidator');

const router = express.Router();

router.post('/', validateUserCreation, userController.register);

router.get('/:user_id', authMiddleware, userController.getById);

router.patch('/:user_id', authMiddleware, validateUserUpdate, userController.update);

router.delete('/:user_id', authMiddleware, userController.delete);

module.exports = router;