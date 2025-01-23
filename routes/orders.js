const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { Order } = require('../models');

const router = express.Router();

// Route pour récupérer les commandes d'un utilisateur
router.get('/', authMiddleware, async (req, res) => {
    const userId = req.user.id;

    const orders = await Order.findAll({ where: { userId } });
    res.json(orders);
});

module.exports = router;
