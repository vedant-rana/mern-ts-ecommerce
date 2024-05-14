/**
 * @purpose to all error in one function
 *
 * @param req http request
 * @param res http response
 * @param next next function
 *
 * @return void
 */
export const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
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
export const TryCatch = (func) => (req, res, next) => {
    return Promise.resolve(func(req, res, next)).catch(next);
};
