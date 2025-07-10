import { DataTypes } from "sequelize";
import { db } from "../db/db.js";

const ClassEnrollment = db.define(
	"ClassEnrollment",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		user_id: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: "Users",
				key: "id",
			},
		},
		class_id: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: "Classes",
				key: "id",
			},
		},
		role: {
			type: DataTypes.ENUM("student", "teacher", "co-teacher"),
			defaultValue: "student",
			allowNull: false,
		},
		status: {
			type: DataTypes.ENUM("active", "inactive", "pending"),
			defaultValue: "active",
		},
		joined_at: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
		last_activity: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
	},
	{
		indexes: [
			{
				unique: true,
				fields: ["user_id", "class_id"],
			},
		],
	}
);

export default ClassEnrollment;
