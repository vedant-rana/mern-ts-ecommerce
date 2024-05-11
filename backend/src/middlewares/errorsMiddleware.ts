import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/CustomError.js";

export const errorMiddleware = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  return res.status(err.statusCode).json({
    success: true,
    message: err.message,
  });
};
