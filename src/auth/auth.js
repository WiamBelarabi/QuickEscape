const jwt = require('jsonwebtoken')
const privateKey = require('../auth/private_key')
const tokenBlacklist = require('../auth/tokenBlacklist')

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) 
    return res.status(401).json({ message: "Vous n'avez pas fourni de jeton d'authentification." });

  const token = authHeader.split(' ')[1];

  // vérifier si le token est dans la blacklist
  if (tokenBlacklist.has(token)) {
    return res.status(401).json({ message: "Token révoqué, veuillez vous reconnecter." });
  }

  try {
    const decoded = jwt.verify(token, privateKey);

    // vérifier userId si présent dans body
    if (req.body.userId && req.body.userId !== decoded.userId) {
      return res.status(401).json({ message: "L'identifiant de l'utilisateur est invalide." });
    }

    req.user = decoded; // contient userId + role
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalide ou expiré.", data: err });
  }
};