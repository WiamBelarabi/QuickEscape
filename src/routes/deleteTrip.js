const { Trip } = require('../db/sequelize')
const { ValidationError, UniqueConstraintError } = require('sequelize')
const { authenticateToken, isAdmin, isClient } = require('../auth/middleware');

module.exports = (app) => {
  app.delete('/api/trip/:id', authenticateToken, isAdmin, (req, res) => {
    Trip.findByPk(req.params.id)
      .then(trip => {        
        if(trip === null) {
          const message = `Le voyage demandé n'existe pas. Réessayez avec un autre identifiant.`
          return res.status(404).json({ message })
        }
        return Trip.destroy({ where: { id: trip.id } })
        .then(_ => {
          const message = `Le voyage avec l'identifiant n°${trip.id} a bien été supprimé.`
          res.json({message, data: trip })
        })
      })
      .catch(error => {
        const message = `Le voyage n'a pas pu être supprimé. Réessayez dans quelques instants.`
        res.status(500).json({ message, data: error })
      })
  })
}