import dotenv from "dotenv";

/*
 * Environment Variables
 */
process.env.NODE_ENV = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env` });
dotenv.config({ path: `.${process.env.NODE_ENV}.env` });

import compression from "compression";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";
import express from "express";
import expressSession from "express-session";
import winston from "winston";
import winstonExpress from "express-winston";

// rutas
import users from "./users/user.router";


const sess: expressSession.SessionOptions = {
	secret: "vefhbicuehwoidfh",
	cookie: {},
};

const index = express();
const port = 3000;

if (index.get("env") === "production") {
	index.set("trust proxy", 1);
	sess.cookie.secure = true;
}

index.use(
	cors({
		origin: "*",
	})
);
index.use(helmet());
index.use(compression());
index.use(bodyParser.urlencoded({ extended: false }));
index.use(bodyParser.json());
index.use(expressSession(sess));

index.use(
	winstonExpress.logger({
		transports: [
			new winston.transports.File({
				level: "info",
				filename: "combined.log",
				format: winston.format.json(),
			}),
		],
		format: winston.format.combine(winston.format.json()),
	})
);

index.get("/", (req, res) => {
	res.send("ok");
});
index.use("/users", users);

index.use(
	winstonExpress.logger({
		transports: [
			new winston.transports.File({
				level: "error",
				filename: "error.log",
				format: winston.format.json(),
			}),
		],
		format: winston.format.combine(winston.format.json()),
	})
);

index.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
