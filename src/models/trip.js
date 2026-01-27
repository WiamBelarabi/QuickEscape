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
            type: DataTypes.TEXT,
            allowNull: false,
            get() {
                const raw = this.getDataValue('photo');
                if (!raw) return [];
                try {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed)) {
                        return parsed.filter((p) => typeof p === 'string' && p.trim() !== '');
                    }
                } catch (err) {
                    // ignore parse errors and fall back to single string
                }
                return typeof raw === 'string' && raw.trim() !== '' ? [raw] : [];
            },
            set(value) {
                if (Array.isArray(value)) {
                    const cleaned = value
                        .filter((p) => typeof p === 'string')
                        .map((p) => p.trim())
                        .filter((p) => p !== '');
                    this.setDataValue('photo', JSON.stringify(cleaned));
                    return;
                }

                if (typeof value === 'string') {
                    const trimmed = value.trim();
                    if (!trimmed) {
                        this.setDataValue('photo', JSON.stringify([]));
                        return;
                    }
                    // If a JSON array string is sent, keep it as-is.
                    if (trimmed.startsWith('[')) {
                        this.setDataValue('photo', trimmed);
                        return;
                    }
                    this.setDataValue('photo', JSON.stringify([trimmed]));
                    return;
                }

                this.setDataValue('photo', JSON.stringify([]));
            },
            validate: {
                notNull: { msg: "l'image est requise" },
                notEmpty: { msg: "l'image est requise" },
                hasAtLeastOnePhoto(value) {
                    try {
                        const parsed = JSON.parse(value);
                        if (!Array.isArray(parsed) || parsed.length === 0) {
                            throw new Error("l'image est requise");
                        }
                    } catch (err) {
                        // If it's not valid JSON, treat it as a single photo string.
                        if (typeof value !== 'string' || value.trim() === '') {
                            throw new Error("l'image est requise");
                        }
                    }
                }
            }
        },
        place_restante :{
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })
}
