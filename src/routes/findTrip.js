const { Op } = require('sequelize')
const { Trip } = require('../db/sequelize');
const { ValidationError, UniqueConstraintError } = require('sequelize')
const { authenticateToken, isAdmin, isClient } = require('../auth/middleware');
// code renvoie la liste des voyage ou ceux qui correspondent à une recherche par nom
module.exports = (app) => {
  app.get('/api/trip', authenticateToken, (req, res) => {
    if(req.query.name) {
      const name = req.query.name
      return Trip.findAndCountAll({ 
        where: { 
          name: {
            [Op.or]: {
              [Op.like]: `%${name}%`,
            }
          }
        },
        order: ['name'],
      })
      .then(({count, rows}) => {
        const message = `Il y a ${count} qui correspondent au terme de recherche ${name}.`
        return res.json({ message, data: rows })
      })
    } 
    else {
      Trip.findAll({ order: ['name'] })
      .then(trips => {
        const message = 'La liste des voyages a bien été récupéré.'
        res.json({ message, data: trips })
      })
      .catch(error => {
        const message = `La liste des voyages n'a pas pu être récupéré. 
                         Réessayez dans quelques instants.`
        res.status(500).json({ message, data: error })
      })
    }
  })
}