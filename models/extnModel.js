const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig.js");

const Menu = sequelize.define(
  "Menu",
  {
    option_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    option_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    prompt_english: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    prompt_urdu: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "menu",
    timestamps: false,
  }
);

const Language = sequelize.define(
  "Language",
  {
    language_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    language_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    tableName: "language",
    timestamps: false,
  }
);

const Submenu = sequelize.define(
  "Submenu",
  {
    submenu_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    parent_option_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    submenu_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    prompt_english: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    prompt_urdu: {
      type: DataTypes.STRING(255),
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
      autoIncrement: true,
    },
    option_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    language_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    file_path: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    audio_data: {
      type: DataTypes.BLOB("long"),
      allowNull: false,
    },
  },
  {
    tableName: "audios",
    timestamps: false,
  }
);

module.exports = { Menu, Language, Submenu, AudioFile };
