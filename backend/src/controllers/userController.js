const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { readDB, writeDB } = require('../db'); 

const formatValidationErrors = (errors) => {
    return {
        message: "Validation error",
        code: "UNPROCESSABLE",
        details: errors.array().map(err => ({ field: err.path, error: err.msg }))
    };
};

exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(formatValidationErrors(errors));
    }

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

    db.users.push(newUser);

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
    
    delete user.password;
    const {...userData } = user;
    res.status(200).json(userData);
};

exports.update = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(formatValidationErrors(errors));
    }
    
    const db = readDB();
    const requestedUserId = req.params.user_id;
    const authenticatedUserId = req.user.id;

    if (requestedUserId !== authenticatedUserId) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const userIndex = db.users.findIndex(u => u.id === requestedUserId);
    
    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }
    
    const user = db.users[userIndex];
    const updates = req.body;

    if ('name' in updates) user.name = updates.name.toUpperCase();
    if ('email' in updates) user.email = updates.email || null;
    if ('phone' in updates) user.phone = updates.phone || null;
    if ('experience' in updates) user.experience = updates.experience || null;
    if ('education' in updates) user.education = updates.education || null;
    
    if (updates.password) {
        user.password = await bcrypt.hash(updates.password, 10);
    }
    
    db.users[userIndex] = user;
    writeDB(db);

    res.status(200).json();
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

    db.users = db.users.filter(u => u.id !== requestedUserId);
    writeDB(db);

    res.status(200).json({ message: 'User deleted successfully' });
};