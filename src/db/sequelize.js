const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('quickescape', 'root', '', {
    host: 'localhost',
    dialect: 'mariadb',
    logging: false
});

sequelize.authenticate()
    .then(() => console.log('Connexion établie avec la base de données.'))
    .catch(err => console.error('Impossible de se connecter à la base de données :', err));