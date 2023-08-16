const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig.js");

exports.Flow = sequelize.define(
  "Flow",
  {
    numbers: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    extension: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "callFlows",
    timestamps: false,
  }
);
