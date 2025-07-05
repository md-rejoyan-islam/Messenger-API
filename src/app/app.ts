import cors from "cors";
import express, { Application } from "express";
import corsOptions from "../config/corsConfig";
import router from "../routes";
import secret from "./secret";

const app: Application = express();

if (secret.nodeEnv === "development") {
  app.use(require("morgan")("dev"));
}

app.use(
  express.json({
    limit: "10mb",
    type: "application/json",
  })
);
app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
    type: "application/x-www-form-urlencoded",
  })
);
app.use(cors(corsOptions));

app.use(router);

export default app;
