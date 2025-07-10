import express from "express";
import {
	createClass,
	getMyClasses,
	getClassById,
	updateClass,
	joinClass,
	leaveClass,
	archiveClass,
} from "../../controllers/class/index.js";
import { verifyToken } from "../../controllers/auth/index.js";

const routes = express.Router();

// All routes require authentication
routes.use(verifyToken);

// Class management routes
routes.post("/", createClass);
routes.get("/", getMyClasses);
routes.get("/:id", getClassById);
routes.put("/:id", updateClass);
routes.delete("/:id/leave", leaveClass);
routes.put("/:id/archive", archiveClass);

// Join class route
routes.post("/join", joinClass);

export default routes;
