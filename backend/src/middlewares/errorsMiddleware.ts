import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/customError.js";
import { ControllerType } from "../types/types.js";

/**
 * @purpose to all error in one function
 *
 * @param req http request
 * @param res http response
 * @param next next function
 *
 * @return void
 */
export const errorMiddleware = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // customizing cast error occuring due to inavallid id of mongodb document
  if (err.name === "CastError") err.message = "Invalid Id";

  return res.status(err.statusCode).json({
    success: true,
    message: err.message,
  });
};

/**
 * @purpose to remove uses of try catch in every controller functions
 *
 * @param req http request
 * @param res http response
 * @param next next function
 *
 * @return void
 */
export const TryCatch =
  (func: ControllerType) =>
  (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(func(req, res, next)).catch(next);
  };
