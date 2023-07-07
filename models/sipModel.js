const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig.js");

const Sip = sequelize.define(
  "Sip",
  {
    SIP_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    DISALLOW: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    HOST: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ALLOW: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    TYPE: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    SECRET: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    DTMFMODE: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    QUALIFY: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    CANREINVITE: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    INSECURE: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    NAT: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    DIRECTMEDIA: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    DIRECTRTPSETUP: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    CONTEXT: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "sip_conf",
    timestamps: false,
  }
);

module.exports = Sip;
