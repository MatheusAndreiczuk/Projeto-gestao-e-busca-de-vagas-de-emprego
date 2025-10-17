const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { readDB } = require('../db'); 

exports.login = async (req, res) => {
    const { username, password } = req.body;
    
    const db = readDB();

    const user = db.users.find(u => u.username === username);

    if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const payload = {
        sub: user.id,
        username: user.username,
        role: 'user',
    };

    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: parseInt(process.env.JWT_EXPIRES_IN) }
    );
    
    res.status(200).json({
        token,
        expires_in: parseInt(process.env.JWT_EXPIRES_IN),
    });
};

exports.logout = (req, res) => {
    res.status(200).json({ message: 'OK' });
};