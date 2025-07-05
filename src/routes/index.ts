import express, { Request, Response } from "express";
import path from "path";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { errorHandler } from "../middleware/errorHandler";
import { errorResponse, successResponse } from "../utils/responseHandler";

import { authRoutes } from "./authRoutes";
import { groupRoutes } from "./groupRoutes";
import { messageRoutes } from "./messageRoutes";
import { userRoutes } from "./userRoutes";

// Swagger UI
const swaggerDocument = YAML.load(
  path.resolve(__dirname, "../../openapi.yaml")
);

// Create a new express router
const router = express.Router();

// home endpoint
router.get("/", (_req: Request, res: Response) => {
  successResponse(res, "Welcome to the Messenger API", {
    version: "1.0.0",
    documentation: "/api-docs",
  });
});

// health check endpoint
router.get("/health", (_req: Request, res: Response) => {
  successResponse(res, "Server is healthy", {
    status: "ok",
  });
});

// Serve Swagger UI documentation
router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

router.use("/api/v1/auth", authRoutes);
router.use("/api/v1/users", userRoutes);
router.use("/api/v1/groups", groupRoutes);
router.use("/api/v1/messages", messageRoutes);

// 404 Not Found handler
router.use((req: Request, res: Response) => {
  const route = req.originalUrl;
  errorResponse(res, `The requested route ${route} does not exist`, {
    statusCode: 404,
    message: "The requested resource was not found",
  });
});

// Global error handler
router.use(errorHandler);

export default router;
