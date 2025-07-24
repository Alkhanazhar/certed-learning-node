const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const basename = path.basename(__filename);
const dbConfig = require("../config/db.config");
const db = {};

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    logging: (msg) => {
        const showMeta = process.env.LOG_DB_METADATA === 'true';
        const showQueries = process.env.LOG_DB_QUERIES === 'true';

        const isMeta =
            msg.includes('INFORMATION_SCHEMA') ||
            msg.includes('SHOW INDEX') ||
            msg.includes('SELECT TABLE_NAME');

        if ((isMeta && showMeta) || (!isMeta && showQueries)) {
            console.log(msg);
        }
    },
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle,
    },
});

fs.readdirSync(__dirname)
    .filter((file) => {
        return (
            file.indexOf('.') !== 0 &&
            file !== basename &&
            file.endsWith('.model.js')
        );
    })
    .forEach((file) => {
        const model = require(path.join(__dirname, file))(sequelize, DataTypes);
        db[model.name] = model;
    });

// 👇 Setup associations if defined
Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;


sequelize
    .authenticate()
    .then(() => {
        console.log(`Connected to database: ${dbConfig.DB}`);
        return sequelize.sync({ force: false });
    })
    .then(async () => {
        console.log('Sequelize models synced.');
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    });

module.exports = db;
