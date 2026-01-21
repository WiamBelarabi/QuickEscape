module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Trip', {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name:{
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
                notNull: { msg: "l'image est requise" },
                notEmpty: { msg: "l'image est requise" }
            }
        },
        place_restante :{
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })
}