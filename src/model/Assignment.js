import { DataTypes } from "sequelize";
import { db } from "../db/db.js";

const Assignment = db.define(
	"Assignment",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1, 200],
			},
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true,    
		},
		class_id: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: "Classes",
				key: "id",
			},
		},
		created_by: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: "Users",
				key: "id",
			},
		},
		due_date: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		points: {
			type: DataTypes.INTEGER,
			defaultValue: 100,
			validate: {
				min: 0,
				max: 1000,
			},
		},
		status: {
			type: DataTypes.ENUM("draft", "published", "archived"),
			defaultValue: "draft",
		},
		assignment_type: {
			type: DataTypes.ENUM("assignment", "quiz", "material"),
			defaultValue: "assignment",
		},
		attachments: {
			type: DataTypes.JSONB,
			defaultValue: [],
		},
		settings: {
			type: DataTypes.JSONB,
			defaultValue: {
				allow_late_submissions: false,
				require_attachments: false,
				allow_comments: true,
			},
		},
	},
	{
		hooks: {
			beforeCreate: (assignment) => {
				if (!assignment.due_date) {
					// Set default due date to 7 days from now
					assignment.due_date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
				}
			},
		},
	}
);

export default Assignment;
