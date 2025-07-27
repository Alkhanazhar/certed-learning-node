const env = process.env.NODE_ENV || "development";

const config = {
  development: {
    HOST: "srv1641.hstgr.io",
    USER: "u844961577_certed_learn",
    PASSWORD: "Latyton@#1993",
    DB: "u844961577_certed_learn",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
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
      idle: 10000,
    },
  },

  production: {
    HOST: "",
    USER: "certed_admin",
    PASSWORD: "10#%pRg@5",
    DB: "certed",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
};

module.exports = config[env];
