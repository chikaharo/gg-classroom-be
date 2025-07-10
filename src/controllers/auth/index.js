import jwt from "jsonwebtoken";
import config from "config";
import response from "../../helpers/response.js";
import { User } from "../../model/index.js";

const privateKey = config.key.privateKey;
const tokenExpireInSeconds = config.key.tokenExpireInSeconds;

// Register new user
export const register = async (req, res) => {
	try {
		const { email, username, password, full_name, role = "student" } = req.body;

		// Validate required fields
		if (!email || !username || !password || !full_name) {
			return response.sendBadRequest(res, "All fields are required");
		}

		// Check if user already exists
		const existingUser = await User.findOne({
			where: {
				[User.sequelize.Op.or]: [{ email }, { username }],
			},
		});

		if (existingUser) {
			return response.sendBadRequest(
				res,
				"User with this email or username already exists"
			);
		}

		// Create new user
		const newUser = await User.create({
			email,
			username,
			password,
			full_name,
			role,
		});

		// Generate token
		const token = jwt.sign(
			{
				id: newUser.id,
				email: newUser.email,
				role: newUser.role,
			},
			privateKey,
			{ expiresIn: tokenExpireInSeconds }
		);

		return response.sendSuccess(res, {
			message: "User registered successfully",
			data: {
				user: newUser.getPublicProfile(),
				token,
			},
		});
	} catch (error) {
		console.error("Registration error:", error);
		return response.sendInternalServerError(res, "Registration failed");
	}
};

// Login user
export const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Validate required fields
		if (!email || !password) {
			return response.sendBadRequest(res, "Email and password are required");
		}

		// Find user by email
		const user = await User.findOne({
			where: { email },
		});

		if (!user) {
			return response.sendUnauthorized(res, "Invalid credentials");
		}

		// Check if user is active
		if (!user.is_active) {
			return response.sendUnauthorized(res, "Account is deactivated");
		}

		// Verify password
		const isPasswordValid = await user.comparePassword(password);
		if (!isPasswordValid) {
			return response.sendUnauthorized(res, "Invalid credentials");
		}

		// Update last login
		await user.update({ last_login: new Date() });

		// Generate token
		const token = jwt.sign(
			{
				id: user.id,
				email: user.email,
				role: user.role,
			},
			privateKey,
			{ expiresIn: tokenExpireInSeconds }
		);

		return response.sendSuccess(res, {
			message: "Login successful",
			data: {
				user: user.getPublicProfile(),
				token,
			},
		});
	} catch (error) {
		console.error("Login error:", error);
		return response.sendInternalServerError(res, "Login failed");
	}
};

// Logout user (client-side token removal)
export const logout = async (req, res) => {
	try {
		return response.sendSuccess(res, {
			message: "Logout successful",
		});
	} catch (error) {
		console.error("Logout error:", error);
		return response.sendInternalServerError(res, "Logout failed");
	}
};

// Get current user profile
export const getProfile = async (req, res) => {
	try {
		const user = await User.findByPk(req.currentUser.id);
		if (!user) {
			return response.sendNotFound(res, "User not found");
		}

		return response.sendSuccess(res, {
			data: {
				user: user.getPublicProfile(),
			},
		});
	} catch (error) {
		console.error("Get profile error:", error);
		return response.sendInternalServerError(res, "Failed to get profile");
	}
};

// Update user profile
export const updateProfile = async (req, res) => {
	try {
		const { full_name, avatar_url, profile } = req.body;
		const user = await User.findByPk(req.currentUser.id);

		if (!user) {
			return response.sendNotFound(res, "User not found");
		}

		// Update allowed fields
		const updateData = {};
		if (full_name) updateData.full_name = full_name;
		if (avatar_url) updateData.avatar_url = avatar_url;
		if (profile) updateData.profile = { ...user.profile, ...profile };

		await user.update(updateData);

		return response.sendSuccess(res, {
			message: "Profile updated successfully",
			data: {
				user: user.getPublicProfile(),
			},
		});
	} catch (error) {
		console.error("Update profile error:", error);
		return response.sendInternalServerError(res, "Failed to update profile");
	}
};

// Verify JWT token middleware
export const verifyToken = async (req, res, next) => {
	try {
		const token =
			req.body.token ||
			req.query.token ||
			req.headers["x-access-token"] ||
			req.headers.authorization?.replace("Bearer ", "");

		if (!token) {
			return response.sendUnauthorized(res, "No token provided");
		}

		const decoded = jwt.verify(token, privateKey);
		const user = await User.findByPk(decoded.id);

		if (!user || !user.is_active) {
			return response.sendUnauthorized(res, "Invalid token");
		}

		req.currentUser = user;
		next();
	} catch (error) {
		console.error("Token verification error:", error);
		return response.sendUnauthorized(res, "Invalid token");
	}
};
