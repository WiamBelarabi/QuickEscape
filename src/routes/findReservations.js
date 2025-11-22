const { Reservation } = require('../db/sequelize')
const { Trip } = require('../db/sequelize')
const { authenticateToken, isClient } = require('../auth/middleware')

module.exports = (app) => {
  app.get('/api/my-reservations', authenticateToken, isClient, async (req, res) => {
    try {
      const userId = req.user.userId;

      // récupérer toutes les réservations de ce client
      const reservations = await Reservation.findAll({
        where: { user_id: userId },
        include: [
          {
            model: Trip,
            attributes: ['id', 'name', 'destination','budget', 'date_depart', 'date_retour', 'description']
          }
        ],
        order: [['date_reservation', 'DESC']]
      });

      if (reservations.length === 0) {
        return res.status(404).json({ message: "Vous n'avez aucune réservation." });
      }

      res.json({
        message: "Liste de vos réservations",
        data: reservations
      });

    } catch (error) {
      res.status(500).json({
        message: "Impossible de récupérer vos réservations. Réessayez plus tard.",
        error
      });
    }
  });
};
