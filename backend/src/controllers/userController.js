const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { readDB, writeDB } = require('../db'); // <-- MUDOU AQUI

const formatValidationErrors = (errors) => {
    return {
        message: "Validation error",
        code: "UNPROCESSABLE",
        details: errors.array().map(err => ({ field: err.param, error: err.msg }))
    };
};

exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(formatValidationErrors(errors));
    }

    // 1. Lê o estado atual do banco de dados
    const db = readDB();

    const { name, username, password, email, phone, experience, education } = req.body;

    if (db.users.find(u => u.username === username)) {
        return res.status(409).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
        id: (db.users.length > 0 ? Math.max(...db.users.map(u => parseInt(u.id))) + 1 : 1).toString(),
        name: name.toUpperCase(),
        username,
        password: hashedPassword,
        email: email || null,
        phone: phone || null,
        experience: experience || null,
        education: education || null
    };

    // 2. Adiciona o novo usuário aos dados
    db.users.push(newUser);

    // 3. Escreve os dados atualizados de volta no arquivo
    writeDB(db);

    res.status(201).json({ message: 'Created' });
};

exports.getById = (req, res) => {
    const db = readDB();
    const requestedUserId = req.params.user_id;
    const authenticatedUserId = req.user.id;

    if (requestedUserId !== authenticatedUserId) {
        return res.status(403).json({ message: 'Forbidden' });
    }
    
    const user = db.users.find(u => u.id === requestedUserId);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    
    const { password, ...userData } = user;
    res.status(200).json(userData);
};

exports.update = async (req, res) => {
    // 1. Validação de entrada primeiro
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(formatValidationErrors(errors));
    }
    
    // 2. Lê o banco de dados
    const db = readDB();
    const requestedUserId = req.params.user_id;
    const authenticatedUserId = req.user.id;

    // 3. Checagens de permissão
    if (requestedUserId !== authenticatedUserId) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const userIndex = db.users.findIndex(u => u.id === requestedUserId);
    
    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }
    
    const user = db.users[userIndex];
    const updates = req.body;

    // 4. Lógica de atualização explícita para cada campo
    // Usar 'in' verifica se a propriedade existe no objeto, mesmo que o valor seja ""
    if ('name' in updates) user.name = updates.name.toUpperCase();
    if ('email' in updates) user.email = updates.email || null;
    if ('phone' in updates) user.phone = updates.phone || null;
    if ('experience' in updates) user.experience = updates.experience || null;
    if ('education' in updates) user.education = updates.education || null;
    
    if (updates.password) {
        user.password = await bcrypt.hash(updates.password, 10);
    }
    
    // 5. Salva as alterações
    db.users[userIndex] = user;
    writeDB(db);

    res.status(200).json({ message: "Updated" });
};

exports.delete = (req, res) => {
    const db = readDB();
    const requestedUserId = req.params.user_id;
    const authenticatedUserId = req.user.id;

    if (requestedUserId !== authenticatedUserId) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const userExists = db.users.some(u => u.id === requestedUserId);
    if (!userExists) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Filtra o array para remover o usuário
    db.users = db.users.filter(u => u.id !== requestedUserId);
    writeDB(db);

    res.status(200).json({ message: 'User deleted successfully' });
};