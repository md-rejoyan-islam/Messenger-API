/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { errorResponse } from "../utils/responseHandler";

const errorHandler = async (
  err: any,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  let message = err.message || "Something went wrong";
  let statusCode = err.statusCode || 500;

  // Mongoose bad ObjectId
  if (err.name === "CastError" && err.kind === "ObjectId") {
    message = `Resource not found with id of ${err.value}`;
    statusCode = 404;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    message = `Duplicate field value entered: ${Object.keys(
      err.keyValue,
    )} already exists`;
    statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    message = Object.values(err.errors)
      .map((val: any) => val.message)
      .join(", ");
    statusCode = 400;
  }

  // zod validation error
  if (err instanceof ZodError) {
    message = err.issues[0].message || "Validation error";
    statusCode = 422;
    // whole error response
    // err.issues
    // .map((issue: ZodIssue) => ({
    //   path : issue.path.join("."),
    //   message: issue.message,
    // }))
  }

  const errorResponseData: any = {
    success: false,
    message,
  };

  if (process.env.NODE_ENV === "development") {
    errorResponseData.stack = err.stack;
  }

  errorResponse(res, message, errorResponseData, statusCode);
};

export { errorHandler };
