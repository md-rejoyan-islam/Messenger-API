import { config } from "dotenv";
config();

const port: number = +(process.env.PORT || 5050);
const mongoURI: string = process.env.MONGO_URI!;
const corsOrigin: string[] = process.env.CORS_ORIGIN?.split(",") || [];
const nodeEnv: string = process.env.NODE_ENV || "development";
const clientUrl: string = process.env.CLIENT_URL!;
const emailFrom: string = process.env.EMAIL_FROM!;
const emailHost: string = process.env.EMAIL_HOST!;
const emailPort: number = +(process.env.EMAIL_PORT || 587);
const emailUsername: string = process.env.EMAIL_USERNAME!;
const emailPassword: string = process.env.EMAIL_PASSWORD!;
const passwordResetTokenExpiration: number =
  +process.env.PASSWORD_RESET_TOKEN_EXPIRATION!;

export default {
  port,
  mongoURI,
  emailFrom,
  corsOrigin,
  nodeEnv,
  clientUrl,
  emailHost,
  emailPort,
  emailUsername,
  emailPassword,
  passwordResetTokenExpiration,
  jwt: {
    accessTokenSecret: process.env.JWT_ACCESS_SECRET,
    refreshTokenSecret: process.env.JWT_REFRESH_SECRET,
    accessTokenExpiresIn: +process.env.JWT_ACCESS_EXPIRES_IN!,
    refreshTokenExpiresIn: +process.env.JWT_REFRESH_EXPIRES_IN!,
  },
};
