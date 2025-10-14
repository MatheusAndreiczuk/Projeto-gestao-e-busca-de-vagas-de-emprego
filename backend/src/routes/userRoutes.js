// src/routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
// O caminho para o validador foi atualizado
const { validateUserCreation, validateUserUpdate } = require('../validators/userValidator');

const router = express.Router();

// POST /users - Cria um novo usuário
router.post('/', validateUserCreation, userController.register);

// GET /users/:user_id - Lê os dados de um usuário
router.get('/:user_id', authMiddleware, userController.getById);

// PUT /users/:user_id - Atualiza um usuário
router.put('/:user_id', authMiddleware, validateUserUpdate, userController.update);

// DELETE /users/:user_id - Deleta um usuário
router.delete('/:user_id', authMiddleware, userController.delete);

module.exports = router;