import express from "express";
import {
	register,
	login,
	logout,
	getProfile,
	updateProfile,
	verifyToken,
} from "../../controllers/auth/index.js";

const routes = express.Router();

// Public routes
routes.post("/register", register);
routes.post("/login", login);
routes.post("/logout", logout);

// Protected routes
routes.get("/profile", verifyToken, getProfile);
routes.put("/profile", verifyToken, updateProfile);

// Test route
routes.get("/", (req, res) => {
	res.status(200).json({ message: "Auth API is working!" });
});

export default routes;
