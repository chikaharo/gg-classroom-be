import { Sequelize } from "sequelize";

// Option 1: Passing a connection URI
export const db = new Sequelize(
	"postgres://postgres:hust@localhost:5432/gg_classroom"
); // Example for postgres

export const connection = async () => {
	try {
		await db.authenticate();
		console.log("Success to connect to database");
	} catch (err) {
		console.error("Unable to connect to database: ", err);
	}
};
