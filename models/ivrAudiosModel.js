const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig.js");

exports.MainMenu = sequelize.define(
  "MainMenu",
  {
    option_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    language_name: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    tableName: "mainMenu",
    timestamps: false,
  }
);

exports.SubMenu = sequelize.define(
  "SubMenu",
  {
    submenu_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    submenu_number: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    language_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    tableName: "subMenu",
    timestamps: false,
  }
);

exports.AudioFiles = sequelize.define(
  "AudioFiles",
  {
    audio_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    file_path: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    submenu_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    language_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    tableName: "audioFiles",
    timestamps: false,
  }
);
