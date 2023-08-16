const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig.js");

exports.Menu = sequelize.define(
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

exports.Submenu = sequelize.define(
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

exports.AudioFile = sequelize.define(
  "AudioFile",
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
    tableName: "audioFile",
    timestamps: false,
  }
);
