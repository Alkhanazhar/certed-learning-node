module.exports = (sequelize, DataTypes) => {
    const Course = sequelize.define('Course', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(512),
            allowNull: false,
        },
        chapters: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        duration: {
            type: DataTypes.INTEGER(100),
            allowNull: false,
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        file_path: {
            type: DataTypes.STRING(1024),
            allowNull: false,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        active: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
          }
    }, {
        sequelize,
        tableName: 'courses',
        underscored: true,
        timestamps: true,
    });

    Course.associate = models => {
    };

    return Course;
};
  