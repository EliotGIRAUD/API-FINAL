const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { Cart, Product } = require('../models');
const bcrypt = require('bcrypt');

const router = express.Router();

router.use(authMiddleware(['client']));
// Route pour voir le contenu du panier
router.get('/', async (req, res) => {
    const userId = req.user.id;
    const cart = await Cart.findAll({ where: { userId } });

    res.json(cart);
});

// Route pour ajouter un produit au panier
router.post('/add', async (req, res) => {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    const product = await Product.findByPk(productId);
    if (!product || product.stock < quantity) {
        return res.status(400).json({ message: 'Produit indisponible ou stock insuffisant' });
    }

    // Ajouter le produit au panier
    const cartItem = await Cart.create({ userId, productId, quantity });
    res.status(201).json(cartItem);
});

module.exports = router;
