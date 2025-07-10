import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import config from "config";

import routes from "./src/routes/index.js";
import { connection } from "./src/db/db.js";
import "./src/model/index.js"; // Import models to set up associations

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));

// Routes
app.use("/api/v1/", routes);

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({
		success: false,
		message: "Something went wrong!",
	});
});

// 404 handler
// app.use("*", (req, res) => {
// 	res.status(404).json({
// 		success: false,
// 		message: "Route not found",
// 	});
// });

const port = process.env.PORT || 4000;

// Start server
const startServer = async () => {
	try {
		// Connect to database
		await connection();

		// Start listening
		app.listen(port, () => {
			console.log(`🚀 Server running on port ${port}`);
			console.log(
				`📚 Google Classroom API ready at http://localhost:${port}/api/v1/`
			);
		});
	} catch (error) {
		console.error("❌ Failed to start server:", error);
		process.exit(1);
	}
};

startServer();

export default app;
