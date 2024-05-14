import { NextFunction, Request, Response } from "express";
import { NewUserRequestBody } from "../types/types.js";
import { User } from "../models/user.js";
import { TryCatch } from "../middlewares/errorsMiddleware.js";
import ErrorHandler from "../utils/customError.js";

/**
 * @purpose to create user object in MongoDB and register user
 *
 * @param req http request
 * @param res http response
 * @param next next function
 *
 * @return void
 */
export const registerUser = TryCatch(
  async (
    req: Request<{}, {}, NewUserRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, email, photo, gender, role, dob, _id }: NewUserRequestBody =
      req.body;

    //Check first if user is already exist then directly login him else register him
    let user = await User.findById(_id);
    if (user) {
      return res.status(200).json({
        success: true,
        message: `Welcome back, ${user.name}`,
      });
    }

    //required fields to register
    if (!_id || !name || !email || !photo || !gender || !dob) {
      return next(new ErrorHandler("All Fields are required", 400));
    }

    //creating new user
    user = await User.create({
      name,
      email,
      photo,
      gender,
      role,
      dob: new Date(dob),
      _id,
    });

    return res.status(200).json({
      success: true,
      message: `Welcome ${user.name} !!!`,
    });
  }
);

/**
 * @purpose to get all users details for admin
 *
 * @param req http request
 * @param res http response
 * @param next next function
 *
 * @return void
 */
export const getAllUsers = TryCatch(async (req, res, next) => {
  const users = await User.find();
  return res.status(200).json({
    success: true,
    users,
  });
});

/**
 * @purpose to get details of single user through _id
 *
 * @param req http request
 * @param res http response
 * @param next next function
 *
 * @return void
 */
export const getUserDetails = TryCatch(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);

  if (!user) return next(new ErrorHandler("Invalid User ID", 400));

  res.status(200).json({
    success: true,
    user,
  });
});

/**
 * @purpose to delete single user through _id
 *
 * @param req http request
 * @param res http response
 * @param next next function
 *
 * @return void
 */
export const deleteUser = TryCatch(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);

  if (!user) return next(new ErrorHandler("Invalid User ID", 400));

  const result = await User.findByIdAndDelete(id);
  if (!result) return next(new ErrorHandler("Error in deleting user", 400));

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});
