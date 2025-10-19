const express = require('express');
const router = express.Router();
const User = require('../dao/models/userModel');
const bcrypt = require('bcrypt');
const { passportAuthenticate, isAdmin, isSelfOrAdmin } = require('../middleware/passport.middleware');

// Registro público
router.post('/', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email y password requeridos' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email ya registrado' });

    const hashed = bcrypt.hashSync(password, 10);
    const user = await User.create({ first_name, last_name, email, age, password: hashed });
    user.password = undefined;
    res.status(201).json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtener todos (admin)
router.get('/', passportAuthenticate('jwt'), isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').lean();
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtener uno (self o admin)
router.get('/:uid', passportAuthenticate('jwt'), isSelfOrAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.uid).select('-password').lean();
    if (!user) return res.status(404).json({ message: 'No encontrado' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Actualizar (self o admin)
router.put('/:uid', passportAuthenticate('jwt'), isSelfOrAdmin, async (req, res) => {
  try {
    const update = { ...req.body };
    if (update.password) update.password = bcrypt.hashSync(update.password, 10);
    const user = await User.findByIdAndUpdate(req.params.uid, update, { new: true }).select('-password').lean();
    if (!user) return res.status(404).json({ message: 'No encontrado' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Eliminar (admin)
router.delete('/:uid', passportAuthenticate('jwt'), isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.uid);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;