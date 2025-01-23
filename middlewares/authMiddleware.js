const jwt = require('jsonwebtoken');

const authMiddleware = (allowedRoles = []) => {
    return (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Token manquant ou invalide' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // Ajouter l'utilisateur décodé à la requête

            if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
                return res.status(403).json({ message: 'Accès interdit' });
            }
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Token invalide ou expiré', error });
        }
    };
};

module.exports = authMiddleware;
