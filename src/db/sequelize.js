const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt')
const UserModel = require('../models/user')
const TripModel = require('../models/trip')
const ReservationModel = require('../models/reservation')

const sequelize = new Sequelize('quickescape', 'root', '', {
    host: 'localhost',
    dialect: 'mariadb'
});

sequelize.authenticate()
    .then(() => console.log('Connexion établie avec la base de données.'))
    .catch(err => console.error('Impossible de se connecter à la base de données :', err));

const User = UserModel(sequelize, DataTypes);
const Trip = TripModel(sequelize, DataTypes);
const Reservation = ReservationModel(sequelize, DataTypes);

const initDb = async () => {
    try {
    await sequelize.sync();  // synchronisation sans effacer les données
        console.log("La base de données a été initialisée.");

        // vérifier si un admin existe déjà
        const adminExists = await User.findOne({ where: { role: 'admin' } });

        if (!adminExists) {
        const admin = await User.create({
            username: 'Wiam',
            password: bcrypt.hashSync('admin', 10),
            role: 'admin'
        });
        console.log(`Utilisateur par défaut créé : ${admin.username} (${admin.role})`);
        } else {
        console.log("Admin par défaut déjà existant.");
        }
    } catch (error) {
        console.error("Erreur lors de l'initialisation de la DB :", error);
    }
}

module.exports = {
    initDb,
    User,
    Trip,
    Reservation
};