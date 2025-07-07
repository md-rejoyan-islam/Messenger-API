import { Response } from "express";

interface ApiResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data?: any;
  error?: any;
}

const successResponse = (
  res: Response,
  message: string,
  data: any = {},
  statusCode: number = 200
): Response => {
  const response: ApiResponse = {
    success: true,
    statusCode,
    message,
    data,
  };
  return res.status(statusCode).json(response);
};

const errorResponse = (
  res: Response,
  message: string,
  error: any = {},
  statusCode: number = 500
): Response => {
  const response: ApiResponse = {
    success: false,
    statusCode,
    message,
    error,
  };

  return res.status(statusCode).json(response);
};

export { errorResponse, successResponse };
