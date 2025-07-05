import { CorsOptions } from "cors";
import secret from "../app/secret";

const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (!origin || secret.corsOrigin.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

export default corsOptions;
