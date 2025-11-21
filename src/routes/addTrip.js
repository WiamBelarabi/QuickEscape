const {Trip} = require('../models/trip')
const { ValidationError, UniqueConstraintError } = require('sequelize')
const { authenticateToken, isAdmin, isClient } = require('./auth.middleware');

module.exports = (app) => {
  app.post('/api/trip', authenticateToken, isAdmin, (req, res) => {
    Trip.create(req.body)
      .then(trip => {
        const message = `Le voyage ${req.body.name} a bien été crée.`
        res.json({ message, data: trip })
      })
      .catch(error => {
        if(error instanceof ValidationError) {
          return res.status(400).json({ message: error.message, data: error });
        }
        if(error instanceof UniqueConstraintError) {
          return res.status(400).json({ message: 'error.message', data: error });
        }
        const message = `Le voyage n'a pas pu être ajouté. Réessayez dans quelques instants.`
        res.status(500).json({ message, data: error })
      })
  })
}