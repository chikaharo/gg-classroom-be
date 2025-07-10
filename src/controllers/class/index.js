import response from "../../helpers/response.js";
import { Class, ClassEnrollment, User } from "../../model/index.js";

// Create a new class
export const createClass = async (req, res) => {
	try {
		const { name, description, section, subject, room } = req.body;
		const teacher_id = req.currentUser.id;

		// Validate required fields
		if (!name) {
			return response.sendBadRequest(res, "Class name is required");
		}

		// Create class
		const newClass = await Class.create({
			name,
			description,
			section,
			subject,
			room,
			teacher_id,
		});

		// Add teacher as class member
		await ClassEnrollment.create({
			user_id: teacher_id,
			class_id: newClass.id,
			role: "teacher",
		});

		return response.sendCreated(res, {
			message: "Class created successfully",
			data: { class: newClass },
		});
	} catch (error) {
		console.error("Create class error:", error);
		return response.sendInternalServerError(res, "Failed to create class");
	}
};

// Get all classes for current user
export const getMyClasses = async (req, res) => {
	try {
		const user_id = req.currentUser.id;
		const { role } = req.query;

		let whereClause = { user_id };
		if (role) {
			whereClause.role = role;
		}

		const enrollments = await ClassEnrollment.findAll({
			where: whereClause,
			include: [
				{
					model: Class,
					as: "class",
					include: [
						{
							model: User,
							as: "teacher",
							attributes: ["id", "full_name", "email", "avatar_url"],
						},
					],
				},
			],
		});

		const classes = enrollments.map((enrollment) => ({
			...enrollment.class.toJSON(),
			enrollment_role: enrollment.role,
			joined_at: enrollment.joined_at,
		}));

		return response.sendSuccess(res, {
			data: { classes },
		});
	} catch (error) {
		console.error("Get my classes error:", error);
		return response.sendInternalServerError(res, "Failed to get classes");
	}
};

// Get class by ID
export const getClassById = async (req, res) => {
	try {
		const { id } = req.params;
		const user_id = req.currentUser.id;

		// Check if user is enrolled in this class
		const enrollment = await ClassEnrollment.findOne({
			where: { class_id: id, user_id },
		});

		if (!enrollment) {
			return response.sendForbidden(res, "You are not enrolled in this class");
		}

		const classData = await Class.findByPk(id, {
			include: [
				{
					model: User,
					as: "teacher",
					attributes: ["id", "full_name", "email", "avatar_url"],
				},
				{
					model: User,
					as: "users",
					attributes: ["id", "full_name", "email", "avatar_url"],
					through: { attributes: ["role", "joined_at"] },
				},
			],
		});

		if (!classData) {
			return response.sendNotFound(res, "Class not found");
		}

		return response.sendSuccess(res, {
			data: { class: classData },
		});
	} catch (error) {
		console.error("Get class error:", error);
		return response.sendInternalServerError(res, "Failed to get class");
	}
};

// Update class
export const updateClass = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, description, section, subject, room, theme_color } = req.body;
		const user_id = req.currentUser.id;

		// Check if user is teacher of this class
		const enrollment = await ClassEnrollment.findOne({
			where: { class_id: id, user_id, role: "teacher" },
		});

		if (!enrollment) {
			return response.sendForbidden(res, "Only teachers can update class");
		}

		const classData = await Class.findByPk(id);
		if (!classData) {
			return response.sendNotFound(res, "Class not found");
		}

		// Update class
		await classData.update({
			name,
			description,
			section,
			subject,
			room,
			theme_color,
		});

		return response.sendSuccess(res, {
			message: "Class updated successfully",
			data: { class: classData },
		});
	} catch (error) {
		console.error("Update class error:", error);
		return response.sendInternalServerError(res, "Failed to update class");
	}
};

// Join class with invite code
export const joinClass = async (req, res) => {
	try {
		const { invite_code } = req.body;
		const user_id = req.currentUser.id;

		if (!invite_code) {
			return response.sendBadRequest(res, "Invite code is required");
		}

		// Find class by invite code
		const classData = await Class.findOne({
			where: { invite_code, status: "active" },
		});

		if (!classData) {
			return response.sendNotFound(
				res,
				"Invalid invite code or class not found"
			);
		}

		// Check if user is already enrolled
		const existingEnrollment = await ClassEnrollment.findOne({
			where: { class_id: classData.id, user_id },
		});

		if (existingEnrollment) {
			return response.sendConflict(
				res,
				"You are already enrolled in this class"
			);
		}

		// Enroll user
		await ClassEnrollment.create({
			user_id,
			class_id: classData.id,
			role: "student",
		});

		return response.sendSuccess(res, {
			message: "Successfully joined class",
			data: { class: classData },
		});
	} catch (error) {
		console.error("Join class error:", error);
		return response.sendInternalServerError(res, "Failed to join class");
	}
};

// Leave class
export const leaveClass = async (req, res) => {
	try {
		const { id } = req.params;
		const user_id = req.currentUser.id;

		// Check if user is enrolled
		const enrollment = await ClassEnrollment.findOne({
			where: { class_id: id, user_id },
		});

		if (!enrollment) {
			return response.sendNotFound(res, "You are not enrolled in this class");
		}

		// Check if user is teacher (teachers cannot leave)
		if (enrollment.role === "teacher") {
			return response.sendForbidden(
				res,
				"Teachers cannot leave their own class"
			);
		}

		// Remove enrollment
		await enrollment.destroy();

		return response.sendSuccess(res, {
			message: "Successfully left class",
		});
	} catch (error) {
		console.error("Leave class error:", error);
		return response.sendInternalServerError(res, "Failed to leave class");
	}
};

// Archive class
export const archiveClass = async (req, res) => {
	try {
		const { id } = req.params;
		const user_id = req.currentUser.id;

		// Check if user is teacher of this class
		const enrollment = await ClassEnrollment.findOne({
			where: { class_id: id, user_id, role: "teacher" },
		});

		if (!enrollment) {
			return response.sendForbidden(res, "Only teachers can archive class");
		}

		const classData = await Class.findByPk(id);
		if (!classData) {
			return response.sendNotFound(res, "Class not found");
		}

		// Archive class
		await classData.update({ status: "archived" });

		return response.sendSuccess(res, {
			message: "Class archived successfully",
		});
	} catch (error) {
		console.error("Archive class error:", error);
		return response.sendInternalServerError(res, "Failed to archive class");
	}
};
