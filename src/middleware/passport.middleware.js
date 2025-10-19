const passport = require('passport');

/**
 * Usar: passportAuthenticate('jwt') o passportAuthenticate('login')
 */
const passportAuthenticate = (strategy) => {
  return (req, res, next) => {
    passport.authenticate(strategy, { session: false }, (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ status: 'error', message: info?.message || 'No autorizado' });
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};

const isAdmin = (req, res, next) => {
  const role = req.user?.role || req.user?.role;
  if (role !== 'admin') return res.status(403).json({ status: 'error', message: 'Requiere rol admin' });
  next();
};

const isSelfOrAdmin = (req, res, next) => {
  const userIdParam = req.params.uid || req.params.id;
  const userId = req.user?.id || req.user?._id?.toString() || req.user?._id;
  const role = req.user?.role;
  if (role === 'admin' || userId === userIdParam) return next();
  return res.status(403).json({ status: 'error', message: 'Permitido solo propietario o admin' });
};

module.exports = {
  passportAuthenticate,
  isAdmin,
  isSelfOrAdmin
};