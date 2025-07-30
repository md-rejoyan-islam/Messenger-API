import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";
import path from "path";
import corsOptions from "../config/corsConfig";
import router from "../routes";
import secret from "./secret";

const app: Application = express();

import morgan from "morgan";

if (secret.nodeEnv === "development") {
  app.use(morgan("dev"));
}

app.use(
  express.json({
    limit: "10mb",
    type: "application/json",
  }),
);
app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
    type: "application/x-www-form-urlencoded",
  }),
);
// static files in public directory
app.use("/public", express.static(path.join(__dirname, "../../public")));

app.use(cors(corsOptions));

app.use(cookieParser());

app.use(router);

export default app;
