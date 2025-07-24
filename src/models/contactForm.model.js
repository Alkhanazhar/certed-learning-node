module.exports = (sequelize, DataTypes) => {
    const ContactForm = sequelize.define('ContactForm', {
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
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        subject: {
            type: DataTypes.STRING(1024),
            allowNull: false,
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'contact_form',
        underscored: true,
        timestamps: true,
    });

    ContactForm.associate = models => {
    };

    return ContactForm;
};
