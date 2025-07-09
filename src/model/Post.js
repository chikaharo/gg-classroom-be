import { Sequelize, DataTypes } from "sequelize";
import { connection as db } from "../db/db.js";

const Post = db.define(
	"Post",
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
	},
	{
		// Other model options go here
	}
);

export default Post;
