const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class list extends Model {}

list.init(
	{
		listname: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		description: {
			type: DataTypes.STRING,
			allowNull: false,
			maxlength: 280,
		},
	},

	{
		sequelize,
	},
);

module.exports = list;
