const express = require('express');
const router = express.Router();
const { Tag } = require('../models');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware(['admin']));

// Créer un nouveau tag
router.post('/add', async (req, res) => {
    try {
        const { name } = req.body;
        const newTag = await Tag.create({ name });
        return res.status(201).json(newTag);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur lors de la création du tag', error });
    }
});

// Récupérer tous les tags
router.get('/', async (req, res) => {
    try {
        const tags = await Tag.findAll();
        return res.status(200).json(tags);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur lors de la récupération des tags', error });
    }
});

// Récupérer un tag par son ID
router.get('/:id', async (req, res) => {
    try {
        const tag = await Tag.findByPk(req.params.id);
        if (!tag) {
            return res.status(404).json({ message: 'Tag non trouvé' });
        }
        return res.status(200).json(tag);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur lors de la récupération du tag', error });
    }
});

// Mettre à jour un tag
router.put('/:id', async (req, res) => {
    try {
        const tag = await Tag.findByPk(req.params.id);
        if (!tag) {
            return res.status(404).json({ message: 'Tag non trouvé' });
        }
        const { name } = req.body;
        tag.name = name || tag.name;
        await tag.save();
        return res.status(200).json(tag);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur lors de la mise à jour du tag', error });
    }
});

// Supprimer un tag
router.delete('/:id', async (req, res) => {
    try {
        const tag = await Tag.findByPk(req.params.id);
        if (!tag) {
            return res.status(404).json({ message: 'Tag non trouvé' });
        }
        await tag.destroy();
        return res.status(200).json({ message: 'Tag supprimé' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur lors de la suppression du tag', error });
    }
});

module.exports = router;
