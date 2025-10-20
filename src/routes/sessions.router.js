const express = require('express');
const router = express.Router();
const passport = require('passport');
const { generateToken } = require('../utils/jwt.utils');
const User = require('../dao/models/userModel');
const { passportAuthenticate } = require('../middleware/passport.middleware');

router.post('/register', async (req, res) => {
  try {
    let { first_name, last_name, email, age, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email y password requeridos' });

    email = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'El email ya está registrado' });

    const user = await User.create({ first_name, last_name, email, age, password });

    const token = generateToken(user);
    return res.status(201).json({ status: 'success', token });
  } catch (error) {
    console.error('Error en /register:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ status: 'error', message: 'Email y password requeridos' });

    email = email.toLowerCase().trim();
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Credenciales inválidas' });
    }

    const isValid = user.comparePassword(password);

    if (!isValid) {
      return res.status(401).json({ status: 'error', message: 'Credenciales inválidas' });
    }

    const token = generateToken(user);
    return res.json({
      status: 'success',
      token,
      user: { name: user.first_name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
});

router.get('/current', passportAuthenticate('jwt'), (req, res) => {
  try {
    const user = req.user.toObject ? req.user.toObject() : { ...req.user };
    delete user.password;
    res.json({ status: 'success', payload: user });
  } catch (error) {
    console.error('Error en /current:', error);
    res.status(500).json({ status: 'error', error: 'Error al obtener el usuario actual' });
  }
});

module.exports = router;