import express from "express";

import { register, authenticate } from "../../controllers/auth/index.js";
import { sendSuccess } from "../../helpers/response.js";

const routes = express.Router();

routes.get("/", (req, res) => {
	sendSuccess(res, { message: "Hello World auth" });
});

routes.route("/register").post(register);

routes.route("/login").post(authenticate);

export default routes;
