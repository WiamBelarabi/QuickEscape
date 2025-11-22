module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Reservation', {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id :{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        trip_id :{
            type : DataTypes.INTEGER,
            allowNull: false
        },
        date_reservation :{
            type: DataTypes.DATE,
            allowNull: false
        },
        status :{
            type: DataTypes.ENUM('payée', 'non_payée'),
            allowNull : false
        },
        montant :{
            type: DataTypes.FLOAT,
            allowNull: false
        },
        ticket_pdf :{
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isUrl: { msg: 'Utilisez uniquement une URL valide pour le ticket PDF.' }
            }
        },
        seats:{
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })
}