const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig.js");

exports.Extn = sequelize.define(
  "Extn",
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
