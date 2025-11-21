module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Trip', {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nom:{
            type: DataTypes.STRING,
            allowNull: false
        },
        destination :{
            type: DataTypes.STRING,
            allowNull: false
        },
        budget :{
            type: DataTypes.FLOAT,
            allowNull: false
        },
        date_depart :{
            type: DataTypes.DATE,
            allowNull: false
        },
        date_retour :{
            type: DataTypes.DATE,
            allowNull: false
        },
        description :{
            type: DataTypes.TEXT,
            allowNull: true
        },
        photo:{
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isUrl: { msg: 'Utilisez uniquement une URL valide pour l\'image.' },
                notNull: { msg: 'L\'image est une propriété requise.'}
            }
        },
        place_restante :{
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })
}