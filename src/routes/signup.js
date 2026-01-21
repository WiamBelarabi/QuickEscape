const { User } = require('../db/sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const privateKey = require('../auth/private_key');

module.exports = (app) => {
  app.post('/api/signup', async (req, res) => {
    try {
      const { username, email, password } = req.body;
      // vérifier si l'utilisateur existe déjà
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res.status(409).json({ message: "Le nom est déjà pris." });
      }
      // hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);
      // créer l'utilisateur, rôle par défaut = client
      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        role: 'client'
      });
      // générer un token JWT
      const token = jwt.sign(
        { userId: newUser.id, role: newUser.role },
        privateKey,
        { expiresIn: '24h' }
      );
      return res.status(201).json({
        message: "Utilisateur créé avec succès",
        data: { id: newUser.id, username: newUser.username, role: newUser.role },
        token
      });

    } catch (error) {
      return res.status(500).json({
        message: "Impossible de créer l'utilisateur, réessayez plus tard",
        data: error
      });
    }
  });
};
