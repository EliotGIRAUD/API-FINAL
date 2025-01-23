const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { User } = require('../models');
const { generateToken } = require('../utils/jwt');

const router = express.Router();

// Signup 
router.post('/signup',
    [
        body('email').isEmail().withMessage('Email invalide'),
        body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: 'Cet email est déjà utilisé' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({ email, password: hashedPassword, role: 'client' });

            const token = generateToken(newUser, '30d'); // Token pour 30 jours

            res.status(201).json({ 
                message: 'Utilisateur créé avec succès', 
                token, 
                user: { id: newUser.id, email: newUser.email, role: newUser.role } 
            });
        } catch (error) {
            res.status(500).json({ message: 'Erreur serveur', error });
        }
    }
);

// Login
router.post('/login',
    [
        body('email').isEmail().withMessage('Email invalide'),
        body('password').notEmpty().withMessage('Le mot de passe est requis'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(401).json({ message: 'Identifiants incorrects' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Identifiants incorrects' });
            }

            const token = generateToken(user, '30d'); // Token pour 30 jours

            res.status(200).json({ 
                message: 'Connexion réussie', 
                token, 
                user: { id: user.id, email: user.email, role: user.role } 
            });
        } catch (error) {
            res.status(500).json({ message: 'Erreur serveur', error });
        }
    }
);

module.exports = router;
