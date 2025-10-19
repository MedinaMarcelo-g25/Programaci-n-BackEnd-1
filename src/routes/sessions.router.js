const express = require('express');
const router = express.Router();
const passport = require('passport');
const { generateToken } = require('../utils/jwt.utils');
const User = require('../dao/models/userModels');

// Registro


router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'El email ya está registrado' });
        }

        const user = await User.create({
            first_name,
            last_name,
            email,
            age,
            password
        });

        const token = generateToken(user);
        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login
router.post('/login', passport.authenticate('login', { session: false }), 
    (req, res) => {
        const token = generateToken(req.user);
        res.json({ token });
    }
);

// Current User
router.get('/current', passport.authenticate('jwt', { session: false }), 
    (req, res) => {
        res.json({ user: req.user });
    }
);

module.exports = router;