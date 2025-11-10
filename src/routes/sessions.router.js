const express = require('express');
const router = express.Router();
const passport = require('passport');
const { generateToken, verifyToken } = require('../utils/jwt.utils');
const User = require('../dao/models/userModel');
const { passportAuthenticate } = require('../middleware/passport.middleware');
const MailService = require('../services/mail.service');

router.post('/register', (req, res, next) => {
  passport.authenticate('register', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(400).json({ status: 'error', message: info?.message || 'Registro fallido' });
    }
    const token = generateToken(user);
    res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 24*60*60*1000 });
    return res.status(201).json({ status: 'success', user: { name: user.first_name, email: user.email, role: user.role } });
  })(req, res, next);
});

router.post('/login', (req, res, next) => {
  passport.authenticate('login', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ status: 'error', message: info?.message || 'Credenciales inválidas' });
    }
    const token = generateToken(user);
    res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 24*60*60*1000 });
    return res.json({ status: 'success', user: { name: user.first_name, email: user.email, role: user.role } });
  })(req, res, next);
});

const UserDTO = require('../dto/user.dto');
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  const dto = new UserDTO(req.user);
  res.json({ status: 'success', user: dto });
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase().trim() });
    if (!user) return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
    await MailService.sendPasswordReset(user);
    res.json({ status: 'success', message: 'Email de recuperación enviado' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token) return res.status(400).json({ status: 'error', message: 'Token requerido' });
    const payload = verifyToken(token);
    const user = await User.findOne({ email: payload.email });
    if (!user) return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });

    const same = await user.comparePassword(newPassword);
    if (same) return res.status(400).json({ status: 'error', message: 'La nueva contraseña no puede ser la misma' });

    user.password = newPassword;
    await user.save(); 
    res.json({ status: 'success', message: 'Contraseña actualizada' });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
});

router.post('/logout', (req, res) => {
  try {
    res.clearCookie('jwt', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
    return res.json({ status: 'success', message: 'Sesión cerrada' });
  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({ status: 'error', message: 'No se pudo cerrar sesión' });
  }
});

module.exports = router;