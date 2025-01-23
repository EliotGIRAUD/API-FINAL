const express = require('express');
require('dotenv').config();
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const productRoutes = require('./routes/product');
const indexRoutes = require('./routes/index');
const tagRoutes = require('./routes/tag');
const productTagRoutes = require('./routes/productTag');

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);

app.use('/product', productRoutes);
app.use('/', indexRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);
app.use('/tag', tagRoutes);
app.use('/productTag', productTagRoutes);

const PORT = 4000;
app.listen(PORT, async () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);

    // try {
    //     await sequelize.sync({ alter: true }); // Synchronise les modèles avec la base de données
    //     console.log('Base de données synchronisée avec succès !');
    // } catch (error) {
    //     console.error('Erreur lors de la synchronisation de la base de données :', error);
    // }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Une erreur serveur est survenue', error: err.message });
});

module.exports = app;

