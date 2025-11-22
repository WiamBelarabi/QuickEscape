const { Reservation } = require('../db/sequelize')
const { Trip } = require('../db/sequelize')
const { User } = require('../db/sequelize')
const { authenticateToken, isAdmin} = require('../auth/middleware')
/*module.exports = (app) => {
  app.get('/api/admin/reservations', authenticateToken, isAdmin , async (req, res) => {
    try {
      // récupérer toutes les réservations avec Trip et User
      const reservations = await Reservation.findAll({
        include: [
          {
            model: Trip,
            attributes: ['id', 'name', 'destination', 'budget', 'date_depart', 'date_retour', 'description', 'photo']
          },
          {
            model: User,
            attributes: ['id', 'username']
          }
        ],
        order: [
          [Trip, 'id', 'ASC'],
          ['date_reservation', 'DESC']
        ]
      });

      if (reservations.length === 0) {
        return res.status(404).json({
          message: "Aucune réservation trouvée."
        });
      }

      // transformer en objets JS simples
      const plainReservations = reservations.map(r => r.toJSON());

      // regroupement par voyage
      const tripsMap = {};
      plainReservations.forEach(reservation => {
        const trip = reservation.Trip;
        if (!trip) return;
        const tripId = trip.id;

        if (!tripsMap[tripId]) {
          tripsMap[tripId] = {
            trip: trip,
            reservationCount: 0,
            reservations: []
          };
        }

        // supprimer Trip de la réservation pour éviter la redondance
        delete reservation.Trip;

        tripsMap[tripId].reservationCount += 1;
        tripsMap[tripId].reservations.push(reservation);
      });

      const result = Object.values(tripsMap);

      res.json({
        message: "Liste des voyages avec leurs réservations et clients.",
        data: result
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Impossible de récupérer les réservations. Réessayez plus tard.",
        error
      });
    }
  });
};*/
module.exports = (app) => {
  /**
   * GET /api/admin/trips-reservations
   * Retourne une liste de voyages avec :
   * - trip: infos du voyage
   * - reservationCount: nombre de réservations pour ce voyage
   * - reservations: liste des réservations de ce voyage
   */
  app.get('/api/admin/trips-reservations', authenticateToken, isAdmin, async (req, res) => {
    try {
      // On récupère TOUTES les réservations avec leur voyage associé
      const reservations = await Reservation.findAll({
        include: [
          {
            model: Trip,
            attributes: ['id', 'name', 'destination', 'budget', 'date_depart', 'date_retour', 'description']
          }
        ],
        order: [
          [Trip, 'id', 'ASC'],          // d'abord par voyage
          ['date_reservation', 'DESC']  // puis par date de réservation
        ]
      })

      if (reservations.length === 0) {
        return res.status(404).json({
          message: "Aucune réservation trouvée."
        })
      }
      // On passe tout en objets simples
      const plainReservations = reservations.map(r => r.toJSON())
      // Regroupement par voyage (Trip)
      const tripsMap = {}
      plainReservations.forEach(reservation => {
        const trip = reservation.Trip
        if (!trip) return // au cas où
        const tripId = trip.id
        // Si on n'a pas encore créé l'entrée pour ce voyage
        if (!tripsMap[tripId]) {
          tripsMap[tripId] = {
            trip: trip,               // infos du voyage
            reservationCount: 0,      // sera incrémenté
            reservations: []          // liste des résa de ce voyage
          }
        }
        // On n'a plus besoin de Trip dans la réservation (déjà dans tripsMap[tripId].trip)
        delete reservation.Trip

        tripsMap[tripId].reservationCount += 1
        tripsMap[tripId].reservations.push(reservation)
      })
      const result = Object.values(tripsMap)
      res.json({
        message: "Liste des voyages avec leurs réservations.",
        data: result
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        message: "Impossible de récupérer les réservations. Réessayez plus tard.",
        error
      })
    }
  })
}