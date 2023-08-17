const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig.js");

const CallFlows = sequelize.define(
  "CallFlows",
  {
    numbers: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    function: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    parameter: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "callFlows",
    timestamps: false,
  }
);
module.exports = CallFlows;
