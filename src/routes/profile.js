const { User } = require('../db/sequelize');
const { authenticateToken, isAdmin, isClient } = require('../auth/middleware');
const bcrypt = require('bcrypt');

module.exports = (app) => {
    app.get('/api/profile', authenticateToken, isClient, async (req, res) => {
        try {
            const userId = req.user.userId;
            const user = await User.findByPk(userId , {
                attributes: ['id', 'username','email']
            });
            if (!user) {
                return res.status(404).json({ message: "Utilisateur introuvable." });
            }
            const userSafe = user.toJSON();
            res.json({
                message: "Votre profil.",
                data: userSafe
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Impossible de rÇ¸cupÇ¸rer votre profil. RÇ¸essayez plus tard.",
                error
            });
        }
    });
    // mettre Çÿ jour le profil (username et/ou password)
    app.put('/api/profile', authenticateToken, async (req, res) => {
        try {
            const userId = req.user.userId;
            const { username, password } = req.body;

            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ message: "Utilisateur introuvable." });
            }

            // si nouveau username fourni, vÇ¸rifier l'unicitÇ¸
            if (username && username !== user.username) {
                const existingUser = await User.findOne({ where: { username } });
                if (existingUser) {
                    return res.status(409).json({ message: "Le nom d'utilisateur est dÇ¸jÇÿ pris." });
                }
                user.username = username;
            }

            // si nouveau password fourni, hasher avant de sauvegarder
            if (password) {
                const hashedPassword = await bcrypt.hash(password, 10);
                user.password = hashedPassword;
            }

            await user.save();

            res.json({
                message: "Profil mis Çÿ jour avec succÇùs.",
                data: { id: user.id, username: user.username, role: user.role }
            });

        } catch (error) {
            res.status(500).json({ message: "Impossible de mettre Çÿ jour le profil.", error });
        }
    });
};
