const passport = require('passport');
const { verifyToken } = require('../utils/jwt.utils');

/**
 * Validar token desde header Authorization: Bearer <token>
 * Pone req.user = decodedToken
 */
const validateToken = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'error', message: 'Token no provisto' });
  }
  const token = auth.split(' ')[1];
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ status: 'error', message: 'Token inválido o expirado' });
  }
};

const checkRole = (roles = []) => {
  return (req, res, next) => {
    const role = req.user?.role;
    if (!role || !roles.includes(role)) {
      return res.status(403).json({ status: 'error', message: 'No tiene permisos' });
    }
    next();
  };
};

module.exports = {
  validateToken,
  checkRole
};