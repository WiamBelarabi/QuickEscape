const { Trip } = require('../db/sequelize')
const { ValidationError, UniqueConstraintError } = require('sequelize')
const { authenticateToken } = require('../auth/middleware')

module.exports = (app) => {
  app.get('/api/trip/:id', authenticateToken, async (req, res) => {
    try {
      const trip = await Trip.findByPk(req.params.id);

      if (!trip) {
        return res.status(404).json({
          message: "Le voyage demandé n'existe pas."
        });
      }
      return res.json({
        message: "Détails du voyage récupérés avec succès",
        data: trip
      });

    } catch (error) {
      return res.status(500).json({
        message: "Erreur lors de la récupération du voyage.",
        data: error
      });
    }
  });
};