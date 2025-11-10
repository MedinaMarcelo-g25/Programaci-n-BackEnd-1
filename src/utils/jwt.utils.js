const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
};

const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};

module.exports = { generateToken, verifyToken, JWT_SECRET };