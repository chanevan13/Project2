const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class item extends Model {}

item.init(
	{
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		goal: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	},
	{ sequelize },
);

module.exports = item;
