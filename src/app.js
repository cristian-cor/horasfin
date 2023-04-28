import dotenv from "dotenv";
/*
 * Environment Variables
 */

process.env.NODE_ENV = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env` });
dotenv.config({ path: `.${process.env.NODE_ENV}.env` });

//dependences
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
import responseTime from "response-time";

const makeApp = () => {

    const app = express();
    if (app.get("env") === "production") {
        app.set("trust proxy", 1);
        sess.cookie.secure = true;
    }

    app.use(
        cors({
            origin: "*",
        })
    );

    app.use(helmet());
    app.use(compression());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(responseTime());

    app.use(
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

    app.get("/", (req, res) => {
        res.send("ok");
    });
    app.use("/users", users);

    app.use(
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

    return { app };
};

export default makeApp;
