import { User } from "../models/user.js";
import ErrorHandler from "../utils/customError.js";
import { TryCatch } from "./errorsMiddleware.js";

/**
 * @purpose to check if the user is logged in and is admin
 *
 * @param req http request
 * @param res http response
 * @param next next function
 *
 * @return void
 */
export const adminOnly = TryCatch(async (req, res, next) => {
  const { id } = req.query;

  if (!id) return next(new ErrorHandler("Login to access the Page", 401));

  const user = await User.findById(id);
  if (!user)
    return next(new ErrorHandler("User not found, Register to the app", 404));

  if (user.role !== "admin")
    return next(new ErrorHandler("Access Denied", 403));

  next();
});
