const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.USERR,
  process.env.PASSWORD,
  {
    host: "localhost",
    dialect: "mariadb",
    logging: false,
  }
);
module.exports = sequelize;
