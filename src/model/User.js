import { DataTypes } from "sequelize";
import { db } from "../db/db.js";

const User = db.define(
	"User",
	{
		// Model attributes are defined here
		username: {
			type: DataTypes.STRING,
		},
		password: {
			type: DataTypes.STRING,
		},
		full_name: {
			type: DataTypes.STRING,
		},
		avatar: {
			type: DataTypes.STRING,
			// allowNull defaults to true
		},
		role: {
			type: DataTypes.ENUM("admin", "teacher", "student"),
			// allowNull defaults to true
		},
	},
	{
		// Other model options go here
	}
);

export default User;
