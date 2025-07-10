import { Sequelize } from "sequelize";
import config from "config";

// Database configuration
const dbConfig = {
	host: process.env.DATABASE_HOST || "localhost",
	port: process.env.DATABASE_PORT || 5432,
	username: process.env.DATABASE_USER || "postgres",
	password: process.env.DATABASE_PASSWORD || "hust",
	database: process.env.DATABASE_NAME || "gg_classroom",
	dialect: "postgres",
	logging: process.env.NODE_ENV === "development" ? console.log : false,
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000,
	},
};

export const db = new Sequelize(dbConfig);

export const connection = async () => {
	try {
		await db.authenticate();
		console.log("✅ Successfully connected to PostgreSQL database");

		// Sync models in development
		if (process.env.NODE_ENV === "development") {
			await db.sync({ alter: true });
			console.log("✅ Database models synchronized");
		}
	} catch (err) {
		console.error("❌ Unable to connect to database: ", err);
		process.exit(1);
	}
};
