import { createRequire as _createRequire } from "module";
const __require = _createRequire(import.meta.url);
const express = __require("express");
import { RouteStrings } from '../utils/RouteStrings.js';
import { getUserDetails, registerUser } from '../controllers/userController.js';
const app = express.Router();
/**
 * @purpose Create/Register a user
 * @method POST
 * @route /api/v1/users/new
 */
app.post(RouteStrings.NEW_USER, registerUser);
/**
 * @purpose get a user details
 * @method GET
 * @route /api/v1/users/details
 */
app.get(RouteStrings.USER_DETAILS, getUserDetails);
export default app;
