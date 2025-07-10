import { DataTypes } from "sequelize";
import { db } from "../db/db.js";
import bcrypt from "bcryptjs";

const User = db.define(
	"User",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true,
			},
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				len: [3, 30],
			},
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		full_name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [2, 100],
			},
		},
		role: {
			type: DataTypes.ENUM("student", "teacher", "admin"),
			defaultValue: "student",
			allowNull: false,
		},
		avatar_url: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue:
				"https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small_2x/default-avatar-photo-placeholder-profile-icon-vector.jpg",
		},
		profile: {
			type: DataTypes.JSONB,
			defaultValue: {},
		},
		is_active: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
		last_login: {
			type: DataTypes.DATE,
			allowNull: true,
		},
	},
	{
		hooks: {
			beforeCreate: async (user) => {
				if (user.password) {
					user.password = await bcrypt.hash(user.password, 12);
				}
			},
			beforeUpdate: async (user) => {
				if (user.changed("password")) {
					user.password = await bcrypt.hash(user.password, 12);
				}
			},
		},
	}
);

// Instance method to compare password
User.prototype.comparePassword = async function (candidatePassword) {
	return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to get public profile
User.prototype.getPublicProfile = function () {
	const userObject = this.toObject ? this.toObject() : this;
	delete userObject.password;
	return userObject;
};

export default User;
