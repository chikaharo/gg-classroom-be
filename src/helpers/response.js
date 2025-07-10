export const sendSuccess = (res, data) => {
	return res.status(200).send({
		success: true,
		...data,
	});
};

export const sendCreated = (res, data) => {
	return res.status(201).send({
		success: true,
		...data,
	});
};

export const sendBadRequest = (res, message) => {
	return res.status(400).send({
		success: false,
		message: message,
	});
};

export const sendUnauthorized = (res, message) => {
	return res.status(401).send({
		success: false,
		message: message,
	});
};

export const sendForbidden = (res) => {
	return res.status(403).send({
		success: false,
		message: "You do not have rights to access this resource.",
	});
};

export const sendNotFound = (res) => {
	return res.status(404).send({
		success: false,
		message: "Resource not found",
	});
};

export const sendConflict = (res, message) => {
	return res.status(409).send({
		success: false,
		message: message,
	});
};

export const sendUnprocessableEntity = (res, message) => {
	return res.status(422).send({
		success: false,
		message: message,
	});
};

export const sendInternalServerError = (
	res,
	message = "Internal server error"
) => {
	return res.status(500).send({
		success: false,
		message: message,
	});
};

export const setHeadersForCORS = (req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, X-Access-Token, Content-Type, Accept, Authorization"
	);
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
	next();
};

// Default export for convenience
export default {
	sendSuccess,
	sendCreated,
	sendBadRequest,
	sendUnauthorized,
	sendForbidden,
	sendNotFound,
	sendConflict,
	sendUnprocessableEntity,
	sendInternalServerError,
	setHeadersForCORS,
};
