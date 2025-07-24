module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(512),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(512),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING(2048),
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'users',
        underscored: true,
        timestamps: true,
        defaultScope: {
            attributes: { exclude: ['password'] }
        },
        scopes: {
            withPassword: {
                attributes: {}
            }
        }
    });

    User.associate = models => {
    };
    return User;
};

