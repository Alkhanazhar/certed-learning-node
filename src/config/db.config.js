const env = process.env.NODE_ENV || "development";

const config = {
    development: {
        HOST: "localhost",
        USER: "root",
        PASSWORD: "",
        DB: "certed_dev",
        dialect: "mysql",
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    },

    test: {
        HOST: "localhost",
        USER: "root",
        PASSWORD: "",
        DB: "",
        dialect: "mysql",
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    },

    production: {
        HOST: "",
        USER: "root",
        PASSWORD: "",
        DB: "certed",
        dialect: "mysql",
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    },
};

module.exports = config[env];
