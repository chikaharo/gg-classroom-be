import { DataTypes } from "sequelize";
import { db } from "../db/db.js";

const Class = db.define(
	"Class",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1, 100],
			},
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		section: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		subject: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		room: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		class_code: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		invite_code: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		teacher_id: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: "Users",
				key: "id",
			},
		},
		status: {
			type: DataTypes.ENUM("active", "archived", "draft"),
			defaultValue: "active",
		},
		settings: {
			type: DataTypes.JSONB,
			defaultValue: {
				allow_students_to_post: true,
				allow_students_to_comment: true,
				show_class_code: true,
			},
		},
		theme_color: {
			type: DataTypes.STRING,
			defaultValue: "#4285f4",
		},
		class_image_url: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	},
	{
		hooks: {
			beforeCreate: async (classInstance) => {
				// Generate unique class code
				if (!classInstance.class_code) {
					classInstance.class_code = generateClassCode();
				}
				// Generate unique invite code
				if (!classInstance.invite_code) {
					classInstance.invite_code = generateInviteCode();
				}
			},
		},
	}
);

// Helper function to generate class code
function generateClassCode() {
	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let result = "";
	for (let i = 0; i < 6; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
}

// Helper function to generate invite code
function generateInviteCode() {
	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let result = "";
	for (let i = 0; i < 8; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
}

export default Class;
