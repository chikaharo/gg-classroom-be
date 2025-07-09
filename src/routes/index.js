import express from "express";

import auth from "./auth/index.js";
// import users from './users';
import { setHeadersForCORS } from "../helpers/response.js";

const routes = express.Router();

routes.use(setHeadersForCORS);

routes.use("/auth", auth);
// routes.use('/users', users);

routes.get("/", (req, res) => {
	res.status(200).json({ message: "Hello World" });
});

routes.use(function (req, res) {
	response.sendNotFound(res);
});

export default routes;
