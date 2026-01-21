const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const UserModel = require('../models/user');
const TripModel = require('../models/trip');
const ReservationModel = require('../models/reservation');

const sequelize = new Sequelize('quickescape', 'root', '', {
    host: 'localhost',
    dialect: 'mariadb'
});

sequelize.authenticate()
    .then(() => console.log('Connexion Ç¸tablie avec la base de donnÇ¸es.'))
    .catch(err => console.error('Impossible de se connecter Çÿ la base de donnÇ¸es :', err));

const User = UserModel(sequelize, DataTypes);
const Trip = TripModel(sequelize, DataTypes);
const Reservation = ReservationModel(sequelize, DataTypes);

// Associations for includes
User.hasMany(Reservation, { foreignKey: 'user_id' });
Reservation.belongsTo(User, { foreignKey: 'user_id' });
Trip.hasMany(Reservation, { foreignKey: 'trip_id' });
Reservation.belongsTo(Trip, { foreignKey: 'trip_id' });

const initDb = async () => {
    try {
        await sequelize.sync();  // synchronisation sans effacer les donnÇ¸es
        console.log("La base de donnÇ¸es a Ç¸tÇ¸ initialisÇ¸e.");

        // vÇ¸rifier si un admin existe dÇ¸jÇÿ
        const adminExists = await User.findOne({ where: { role: 'admin' } });

        if (!adminExists) {
            const admin = await User.create({
                username: 'Wiam',
                password: bcrypt.hashSync('admin', 10),
                role: 'admin',
                email: 'wiam@gmail.com'
            });
            console.log(`Utilisateur par dÇ¸faut crÇ¸Ç¸ : ${admin.username} (${admin.role})`);
        } else {
            console.log("Admin par dÇ¸faut dÇ¸jÇÿ existant.");
        }
    } catch (error) {
        console.error("Erreur lors de l'initialisation de la DB :", error);
    }
};

module.exports = {
    initDb,
    User,
    Trip,
    Reservation
};
