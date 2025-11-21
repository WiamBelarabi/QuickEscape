const {Trip} = require('../models/trip')
const { ValidationError, UniqueConstraintError } = require('sequelize')
const { authenticateToken, isAdmin, isClient } = require('../auth/middleware');

module.exports = (app) => {
  app.put('/api/trip/:id', authenticateToken, isAdmin,(req, res) => {
    const id = req.params.id
    Trip.update(req.body, {
      where: { id: id }
    })
    .then(_ => {
      return Trip.findByPk(id).then(trip => {
        if(trip === null) {
          const message = `Le voyage demandé n'existe pas. Réessayez avec un autre identifiant.`
          return res.status(404).json({ message })
        }

        const message = `Le voyage ${trip.name} a bien été modifié.`
        res.json({message, data: trip })
      })
    })
    .catch(error => {
      if(error instanceof ValidationError) {
        return res.status(400).json({ message: error.message, data: error });
      }
      if(error instanceof UniqueConstraintError) {
        return res.status(400).json({ message: 'error.message', data: error });
      }
      const message = `Le voyage n'a pas pu être modifié. Réessayez dans quelques instants.`
      res.status(500).json({ message, data: error })
    })
  })
}