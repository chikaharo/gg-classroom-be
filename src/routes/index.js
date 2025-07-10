import express from "express";

import auth from "./auth/index.js";
import classRoutes from "./class/index.js";
import { setHeadersForCORS } from "../helpers/response.js";

const routes = express.Router();

routes.use(setHeadersForCORS);

// Auth routes
routes.use("/auth", auth);

// // Class routes
routes.use("/classes", classRoutes);

// // Health check route
routes.get("/", (req, res) => {
	res.status(200).json({
		message: "Google Classroom API is running!",
		version: "1.0.0",
		endpoints: {
			auth: "/api/v1/auth",
			classes: "/api/v1/classes",
		},
	});
});

// 404 handler for API routes
// routes.all("*", (req, res) => {
// 	res.status(404).json({
// 		success: false,
// 		message: "API endpoint not found",
// 	});
// });

export default routes;
