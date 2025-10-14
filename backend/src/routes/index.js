// src/routes/index.js
const express = require('express');

// Importando controllers e middlewares necessários para as rotas "raiz"
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Importando os roteadores específicos
const userRoutes = require('./userRoutes');
// const companyRoutes = require('./companyRoutes'); // <-- Pronto para o futuro

const router = express.Router();

// --- ROTAS GLOBAIS DE AUTENTICAÇÃO ---
router.post('/login', authController.login);
router.post('/logout', authMiddleware, authController.logout);

// --- AGRUPAMENTO DE ROTAS POR RECURSO ---
// Todas as rotas definidas em userRoutes.js serão prefixadas com /users
router.use('/users', userRoutes);

// Quando for implementar empresas, basta adicionar a linha abaixo
// router.use('/companies', companyRoutes);

module.exports = router;