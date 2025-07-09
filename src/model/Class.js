import { Sequelize, DataTypes } from "sequelize";
import { connection as db } from "../db/db.js";

const Class = db.define(
	"Class",
	{
		// Model attributes are defined here
		name: {
			type: DataTypes.STRING,
		},
		description: {
			type: DataTypes.STRING,
		},
		teacher_id: {
			type: DataTypes.INTEGER,
		},
		student_ids: {
			type: DataTypes.ARRAY(DataTypes.INTEGER),
		},
	},
	{
		// Other model options go here
	}
);

export default Class;
