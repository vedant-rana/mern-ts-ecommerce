import { createRequire as _createRequire } from "module";
const __require = _createRequire(import.meta.url);
const express = __require("express");
import { deleteUser, getAllUsers, getUserDetails, registerUser, } from "../controllers/userController.js";
import { adminOnly } from "../middlewares/auth.js";
import { RouteStrings } from "../utils/routeStrings.js";
const app = express.Router();
/**
 * @purpose Create/Register a user
 * @method POST
 * @route /api/v1/users/new
 */
app.post(RouteStrings.NEW_USER, registerUser);
/**
 * @purpose get all user details (admin only)
 * @method GET
 * @route /api/v1/users/all
 */
app.get(RouteStrings.ALL_USERS, adminOnly, getAllUsers);
/**
 * @purpose get a user details
 * @method GET
 * @route /api/v1/users/:id
 */
app.get(RouteStrings.SINGLE_USER_ID, getUserDetails);
/**
 * @purpose delete a user (admin only)
 * @method DELETE
 * @route /api/v1/users/:id
 */
app.delete(RouteStrings.SINGLE_USER_ID, adminOnly, deleteUser);
export default app;
