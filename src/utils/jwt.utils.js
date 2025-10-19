const jwt = require('jsonwebtoken');

const JWT_SECRET = 'tu_secreto_seguro';

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