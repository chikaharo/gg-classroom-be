import User from "./User.js";
import Class from "./Class.js";
import ClassEnrollment from "./ClassEnrollment.js";
import Assignment from "./Assignment.js";
import Submission from "./Submission.js";

// User - Class (Many-to-Many through ClassEnrollment)
User.belongsToMany(Class, {
	through: ClassEnrollment,
	foreignKey: "user_id",
	as: "classes",
});

Class.belongsToMany(User, {
	through: ClassEnrollment,
	foreignKey: "class_id",
	as: "users",
});

// User - Class (One-to-Many for teacher)
User.hasMany(Class, {
	foreignKey: "teacher_id",
	as: "taughtClasses",
});

Class.belongsTo(User, {
	foreignKey: "teacher_id",
	as: "teacher",
});

// Class - Assignment (One-to-Many)
Class.hasMany(Assignment, {
	foreignKey: "class_id",
	as: "assignments",
});

Assignment.belongsTo(Class, {
	foreignKey: "class_id",
	as: "class",
});

// User - Assignment (One-to-Many for creator)
User.hasMany(Assignment, {
	foreignKey: "created_by",
	as: "createdAssignments",
});

Assignment.belongsTo(User, {
	foreignKey: "created_by",
	as: "creator",
});

// Assignment - Submission (One-to-Many)
Assignment.hasMany(Submission, {
	foreignKey: "assignment_id",
	as: "submissions",
});

Submission.belongsTo(Assignment, {
	foreignKey: "assignment_id",
	as: "assignment",
});

// User - Submission (One-to-Many for student)
User.hasMany(Submission, {
	foreignKey: "student_id",
	as: "submissions",
});

Submission.belongsTo(User, {
	foreignKey: "student_id",
	as: "student",
});

// User - Submission (One-to-Many for grader)
User.hasMany(Submission, {
	foreignKey: "graded_by",
	as: "gradedSubmissions",
});

Submission.belongsTo(User, {
	foreignKey: "graded_by",
	as: "grader",
});

export { User, Class, ClassEnrollment, Assignment, Submission };
