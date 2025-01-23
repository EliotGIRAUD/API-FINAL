const express = require('express');
const router = express.Router();
const { Product, Tag } = require('../models');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware(['admin']));

// Ajouter un tag à un produit
router.post('/', async (req, res) => {
    try {
        const { productId, tagId } = req.body;
        const product = await Product.findByPk(productId);
        const tag = await Tag.findByPk(tagId);

        if (!product || !tag) {
            return res.status(404).json({ message: 'Produit ou tag non trouvé' });
        }

        await product.addTag(tag);
        return res.status(201).json({ message: 'Tag ajouté au produit' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur lors de l\'ajout du tag', error });
    }
});

// Supprimer un tag d'un produit
router.delete('/', async (req, res) => {
    try {
        const { productId, tagId } = req.body;
        const product = await Product.findByPk(productId);
        const tag = await Tag.findByPk(tagId);

        if (!product || !tag) {
            return res.status(404).json({ message: 'Produit ou tag non trouvé' });
        }

        await product.removeTag(tag);
        return res.status(200).json({ message: 'Tag supprimé du produit' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur lors de la suppression du tag', error });
    }
});

// Récupérer les tags associés à un produit
router.get('/:productId', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.productId, {
            include: {
                model: Tag,
                as: 'tags'
            }
        });

        if (!product) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }

        return res.status(200).json(product.tags);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur lors de la récupération des tags', error });
    }
});

// Récupérer tous les produits associés à un tag
router.get('/tag/:tagId', async (req, res) => {
    try {
        const tag = await Tag.findByPk(req.params.tagId, {
            include: {
                model: Product,
                as: 'products'
            }
        });

        if (!tag) {
            return res.status(404).json({ message: 'Tag non trouvé' });
        }

        return res.status(200).json(tag.products);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur lors de la récupération des produits', error });
    }
});

module.exports = router;
