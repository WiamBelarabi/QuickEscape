const { Reservation } = require('../db/sequelize')
const { Trip } = require('../db/sequelize')
const { authenticateToken, isClient } = require('../auth/middleware')

module.exports = (app) => {
    app.post('/api/trip/:id/reserve', authenticateToken, isClient, async (req, res) => {
        try {
            const userId = req.user.userId;   // vient du token
            const tripId = req.params.id; // vient de l’URL
            const seats = req.body.seats;
            // vérifier que le voyage existe
            const trip = await Trip.findByPk(tripId);
            if (!trip) {
                return res.status(404).json({ message: "Le voyage demandé n'existe pas." });
            }
            if (trip.place_restante < seats) {
                return res.status(400).json({ message: "pas assez de places disponibles." });
            }
            // créer la réservation
            const reservation = await Reservation.create({
                user_id: userId,
                trip_id: tripId,
                seats : req.body.seats,
                date_reservation: new Date(),
                status: 'non_payée',
                montant: trip.budget * req.body.seats,
                ticket_pdf: null
            });
            trip.place_restante -= seats;
            await trip.save();

            res.status(201).json({
                message: "Réservation effectuée avec succès",
                data: reservation
            });

        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la réservation.", error });
        }
    });
};