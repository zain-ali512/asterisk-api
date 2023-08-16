const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig.js");

exports.Agents = sequelize.define(
    "Agents",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        number: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        subscibed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        }
    },
    {
        tableName: "agents",
        timestamps: false,
    }
);
