const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig.js");

exports.Sips = sequelize.define(
  "Sips",
  {
    sip_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    disallow: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    host: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    allow: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    secret: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dtmfmode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    qualify: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    canreinvite: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    insecure: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nat: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    directmedia: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    directrtpsetup: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    context: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "sips",
    timestamps: false,
  }
);
