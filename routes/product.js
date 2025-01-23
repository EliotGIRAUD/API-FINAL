const express = require('express');
const { Product, Tag } = require('../models');
const router = express.Router();

// **1. Lister les produits avec pagination et filtrage**
router.get('/', async (req, res) => {
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

// **3. Créer un produit (admin)**
router.post('/', async (req, res) => {
    const { title, price, description, stock, tags } = req.body;

    try {
        const product = await Product.create({ title, price, description, stock });

        // Ajouter des tags
        if (tags && tags.length) {
            const tagInstances = await Tag.findAll({ where: { name: tags } });
            await product.addTags(tagInstances);
        }

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création du produit.' });
    }
});

// **4. Modifier un produit (admin)**
router.put('/:id', async (req, res) => {
    const { title, price, description, stock, tags } = req.body;

    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Produit non trouvé.' });
        }

        await product.update({ title, price, description, stock });

        // Mettre à jour les tags
        if (tags && tags.length) {
            const tagInstances = await Tag.findAll({ where: { name: tags } });
            await product.setTags(tagInstances);
        }

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
