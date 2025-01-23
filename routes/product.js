const express = require('express');
const { Product, Tag, Sequelize } = require('../models');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { Op } = require('sequelize');

// **1. Lister les produits avec pagination et filtrage**
router.get('/',  async (req, res) => {
    const { page = 1, size = 10, tags } = req.query;

    try {
        const where = {};

        // Filtrage par tags
        if (tags) {
            const tagList = tags.split(',');
            where['$tags.name$'] = tagList;
        }

        const products = await Product.findAndCountAll({
            where: where,
            include: [
                {
                    model: Tag,
                    as: 'tags',
                    attributes: ['name'],
                },
            ],
            limit: parseInt(size),
            offset: (parseInt(page) - 1) * parseInt(size),
        });

        res.json({
            total: products.count,
            products: products.rows,
            currentPage: page,
        });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des produits.' });
    }
});

router.get('/filter', async (req, res) => {
    try {
        // Récupération des paramètres
        const { minPrice, maxPrice, tags } = req.query;
        console.log('Params de filtrage:', { minPrice, maxPrice, tags });

        // Construction de la clause WHERE pour les produits
        const whereClause = {};

        if (minPrice) whereClause.price = { [Op.gte]: parseFloat(minPrice) }; // Prix >= minPrice
        if (maxPrice) whereClause.price = { ...whereClause.price, [Op.lte]: parseFloat(maxPrice) }; // Prix <= maxPrice

        // Gestion des tags
        let tagsFilter = [];
        if (tags) {
            tagsFilter = tags.split(',');
        }

        const products = await Product.findAll({
            where: whereClause,
            include: tagsFilter.length
                ? [
                    {
                        model: Tag,
                        as: 'tags',
                        where: { name: { [Op.in]: tagsFilter } },
                        through: { attributes: [] }, // Ignore les colonnes de la table pivot
                    },
                ]
                : [], // Pas de filtre sur les tags si aucun tag n'est spécifié
        });

        res.json(products);
    } catch (error) {
        console.error('Erreur lors du filtrage des produits:', error);
        res.status(500).json({ message: 'Erreur serveur', error: { name: error.name } });
    }
});


// **2. Voir les détails d’un produit**
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [{ model: Tag, as: 'tags', attributes: ['name'] }],
        });

        if (!product) {
            return res.status(404).json({ error: 'Produit non trouvé.' });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération du produit.' });
    }
});

router.use(authMiddleware(['admin']));

// **3. Créer un produit (admin)**
router.post('/add', async (req, res) => {
    const { title, price, description, stock } = req.body;

    try {
        const product = await Product.create({ title, price, description, stock });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création du produit.' });
    }
});

// Route pour ajouter plusieurs produits
router.post('/add-multiple', async (req, res) => {
    const products = req.body; // Un tableau de produits à ajouter

    try {
        const createdProducts = await Product.bulkCreate(products); // Utiliser bulkCreate pour un gros feed
        res.status(201).json(createdProducts);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de l\'ajout des produits', error });
    }
});

// **4. Modifier un produit (admin)**
router.put('/:id', async (req, res) => {
    const { title, price, description, stock } = req.body;

    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Produit non trouvé.' });
        }

        await product.update({ title, price, description, stock });


        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la modification du produit.' });
    }
});

// **5. Supprimer un produit (admin)**
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Produit non trouvé.' });
        }

        await product.destroy();
        res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la suppression du produit.' });
        }
});

module.exports = router;
