const tokenBlacklist = require('../auth/tokenBlacklist');

module.exports = (app) => {
  app.post('/api/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(400).json({ message: "Aucun token fourni" });

    const token = authHeader.split(' ')[1];
    tokenBlacklist.add(token);

    res.json({ message: "Déconnexion réussie, token invalide côté serveur" });
  });
};
