import { User } from "../models/User.js";
export const getUserDetails = async (req, res, next) => {
    console.log("request hitted");
    res.status(200).json({
        success: true,
        message: `Welcome Hari Bhai !!!`,
    });
};
/**
 * @purpose to create user object in MongoDB and register user
 *
 * @param req http request
 * @param res http response
 * @param next next function
 *
 * @return void
 */
export const registerUser = async (req, res, next) => {
    try {
        const { name, email, photo, gender, role, dob, _id } = req.body;
        const user = await User.create({
            name,
            email,
            photo,
            gender,
            role,
            dob: new Date(dob),
            _id,
        });
        res.status(200).json({
            success: true,
            message: `Welcome ${user.name} !!!`,
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err,
        });
    }
};
