const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig.js");

exports.Extension = sequelize.define(
  "Extension",
  {
    EXT_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    TYPE: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    HOST: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    SECRET: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    CONTEXT: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "extensions",
    timestamps: false,
  }
);
