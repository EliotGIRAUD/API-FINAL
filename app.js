const express = require('express');
const { sequelize } = require('./models'); // Importer sequelize depuis index.js
const productRoutes = require('./routes/product');
const indexRoutes = require('./routes/index');

const app = express();
app.use(express.json());


app.use('/products', productRoutes);
app.use('/', indexRoutes);


// Lancer le serveur et synchroniser la base
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);

    // try {
    //     await sequelize.sync({ alter: true }); // Synchronise les modèles avec la base de données
    //     console.log('Base de données synchronisée avec succès !');
    // } catch (error) {
    //     console.error('Erreur lors de la synchronisation de la base de données :', error);
    // }
});
