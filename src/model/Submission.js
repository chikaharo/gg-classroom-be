import { DataTypes } from "sequelize";
import { db } from "../db/db.js";

const Submission = db.define(
	"Submission",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		assignment_id: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: "Assignments",
				key: "id",
			},
		},
		student_id: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: "Users",
				key: "id",
			},
		},
		content: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		attachments: {
			type: DataTypes.JSONB,
			defaultValue: [],
		},
		submitted_at: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
		grade: {
			type: DataTypes.DECIMAL(5, 2),
			allowNull: true,
			validate: {
				min: 0,
				max: 100,
			},
		},
		feedback: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		status: {
			type: DataTypes.ENUM("submitted", "late", "graded", "returned"),
			defaultValue: "submitted",
		},
		graded_by: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: "Users",
				key: "id",
			},
		},
		graded_at: {
			type: DataTypes.DATE,
			allowNull: true,
		},
	},
	{
		indexes: [
			{
				unique: true,
				fields: ["assignment_id", "student_id"],
			},
		],
		hooks: {
			beforeCreate: (submission) => {
				// Check if submission is late
				if (submission.submitted_at) {
					// This will be handled in the controller
				}
			},
		},
	}
);

export default Submission;
