const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.USERR,
  process.env.PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
    logging: false,
  }
);
module.exports = sequelize;
