const jwt = require('jsonwebtoken');

function generateToken(user, expiration = '1d') {
    try {
        // Vérifie que la clé secrète est bien définie dans le fichier .env
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not defined in the environment variables.');
            return null;
        }

        // Génère un token JWT en utilisant la clé secrète
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: expiration }
        );

        return token;
    } catch (error) {
        console.error('Erreur lors de la génération du token:', error);
        return null;
    }
}

module.exports = { generateToken };
