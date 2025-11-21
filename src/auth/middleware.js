const jwt = require('jsonwebtoken');
const privateKey = require('./private_key');
const tokenBlacklist = require('./tokenBlacklist'); 

// middleware principal pour vérifier JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Vous n'avez pas fourni de jeton d'authentification." });
  }

  const token = authHeader.split(' ')[1];

  // vérifier si le token a été révoqué (logout)
  if (tokenBlacklist && tokenBlacklist.has(token)) {
    return res.status(401).json({ message: "Token révoqué, veuillez vous reconnecter." });
  }

  try {
    const decoded = jwt.verify(token, privateKey);
    req.user = decoded; // contient userId + role
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalide ou expiré.", data: err });
  }
}

// middleware pour restreindre aux admins uniquement
function isAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: "Accès refusé, rôle admin requis." });
  }
  next();
}

// middleware pour restreindre aux clients uniquement
function isClient(req, res, next) {
  if (!req.user || req.user.role !== 'client') {
    return res.status(403).json({ message: "Accès refusé, rôle client requis." });
  }
  next();
}

module.exports = { authenticateToken, isAdmin, isClient };
