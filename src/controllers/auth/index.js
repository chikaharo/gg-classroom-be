import jwt from "jsonwebtoken";
import config from "config";
import {
	sendSuccess,
	sendCreated,
	sendInternalServerError,
	sendUnauthorized,
} from "../../helpers/response.js";

import User from "../../model/User.js";

// const privateKey = config.key.privateKey;
// const tokenExpireInSeconds = config.key.tokenExpireInSeconds;

export const register = async (req, res) => {
	User.findOne({ where: { username: req.body.username } }).exec(function (
		err,
		user
	) {
		if (err) throw err;

		if (user) {
			sendInternalServerError(res, "User already exists.");
		} else {
			const newUser = new User({
				username: req.body.username,
				password: req.body.password,
				full_name: req.body.full_name,
				avatar: req.body.avatar,
				role: "student",
			});

			newUser.save(function (err, user) {
				if (err) throw err;
				sendCreated(res, {
					success: true,
					message: "User created.",
					data: { user: newUser },
				});
			});
		}
	});
};

export const authenticate = async (req, res) => {
	User.findOne({ username: req.body.username }).exec(function (err, user) {
		if (err) throw err;

		if (!user) {
			console.log("User not found");
			sendUnauthorized(res, "Authentication failed.");
		} else if (user) {
			user.verifyPassword(req.body.password, function (_err, isMatch) {
				if (_err) {
					console.log("Error verifying password");
					sendInternalServerError(res, "Internal server error.");
				}
				if (isMatch) {
					console.log("User found and password matched");
					const token = jwt.sign(user.getTokenData(), privateKey, {
						expiresIn: tokenExpireInSeconds,
					});

					sendSuccess({
						success: true,
						message: "Token created.",
						data: { token: token },
					});
				} else {
					console.log("Password not match");
					sendUnauthorized(res, "Authentication failed.");
				}
			});
		}
	});
};

export const verifyToken = async (req, res, next) => {
	const token =
		req.body.token || req.query.token || req.headers["x-access-token"];

	if (token) {
		jwt.verify(token, privateKey, function (err, decoded) {
			if (err) {
				sendUnauthorized(res, "Failed to authenticate token.");
			} else {
				User.findById(decoded.id, function (err, user) {
					if (err) res.send(err);
					req.currentUser = user;
					next();
				});
			}
		});
	} else {
		sendUnauthorized(res, "No token provided.");
	}
};
