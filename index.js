import express from "express";
import bodyParser from "body-parser";
// import mongoose from'mongoose';
import morgan from "morgan";
import jwt from "jsonwebtoken";

// import User from './models/user';
// import Item from './models/item';

import config from "config";
// import db from './db/db';
import routes from "./src/routes/index.js";
import { connection } from "./src/db/db.js";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use("/api/v1/", routes);

// const portConfig = config.get("server.port");

const port = process.env.PORT || 4000;
app.listen(port);
console.log("Node + Express REST API skeleton server started on port: " + port);

connection();

export default app;
