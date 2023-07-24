const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig.js");

const Menu = sequelize.define(
  "Menu",
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
    tableName: "menu",
    timestamps: false,
  }
);

const Submenu = sequelize.define(
  "Submenu",
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
    tableName: "submenu",
    timestamps: false,
  }
);

const AudioFile = sequelize.define(
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
    tableName: "audios",
    timestamps: false,
  }
);

module.exports = { Menu, Submenu, AudioFile };
