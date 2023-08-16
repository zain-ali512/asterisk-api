const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig.js");

exports.Extensions = sequelize.define(
  "Extensions",
  {
    context: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    extension: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "extensions",
    timestamps: false,
  }
);
