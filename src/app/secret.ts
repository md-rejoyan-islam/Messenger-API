import { config } from "dotenv";
config();

const port: number = +(process.env.PORT || 5050);
const mongoURI: string = process.env.MONGO_URI!;
const jwtSecret: string = process.env.JWT_SECRET!;
const jwtExpireIn: number = +(process.env.JWT_EXPIRE_IN || 3600);
const corsOrigin: string[] = process.env.CORS_ORIGIN?.split(",") || [];
const nodeEnv: string = process.env.NODE_ENV || "development";
const clientUrl: string = process.env.CLIENT_URL!;
const emailFrom: string = process.env.EMAIL_FROM!;
const emailHost: string = process.env.EMAIL_HOST!;
const emailPort: number = +(process.env.EMAIL_PORT || 587);
const emailUsername: string = process.env.EMAIL_USERNAME!;
const emailPassword: string = process.env.EMAIL_PASSWORD!;

export default {
  port,
  mongoURI,
  jwtSecret,
  emailFrom,
  corsOrigin,
  nodeEnv,
  jwtExpireIn,
  clientUrl,
  emailHost,
  emailPort,
  emailUsername,
  emailPassword,
};
