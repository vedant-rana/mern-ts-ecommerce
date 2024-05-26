import { stripe } from "../app.js";
import { TryCatch } from "../middlewares/errorsMiddleware.js";
import { Coupon } from "../models/coupon.js";
import ErrorHandler from "../utils/customError.js";

/**
 * @purpose to create payment methods with stripe
 *
 * @param req http request
 * @param res http response
 * @param next next function
 *
 * @return void
 */
export const createPaymentIntent = TryCatch(async (req, res, next) => {
  const { amount } = req.body;
  if (!amount) {
    return next(new ErrorHandler("Please enter amount", 400));
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Number(amount) * 100,
    currency: "inr",
  });

  res.status(201).json({
    success: true,
    clientSecret: paymentIntent.client_secret,
  });
});
/**
 * @purpose to create coupon with code and amount
 *
 * @param req http request
 * @param res http response
 * @param next next function
 *
 * @return void
 */
export const newCoupon = TryCatch(async (req, res, next) => {
  const { couponCode, amount } = req.body;
  if (!couponCode || !amount) {
    return next(
      new ErrorHandler("Please enter both coupon code and amount", 400)
    );
  }

  const coupon = await Coupon.create({ couponCode, amount });

  res.status(201).json({
    success: true,
    message: `Coupon ${coupon.couponCode} created successfully`,
  });
});

/**
 * @purpose to apply discount in order
 *
 * @param req http request
 * @param res http response
 * @param next next function
 *
 * @return void
 */
export const applyDiscount = TryCatch(async (req, res, next) => {
  const { couponCode } = req.query;
  if (!couponCode)
    return next(new ErrorHandler("Coupon Code is required", 400));

  const discount = await Coupon.findOne({ couponCode });

  if (!discount) return next(new ErrorHandler("Invalid Coupon Code", 400));

  res.status(200).json({
    success: true,
    discount: discount.amount,
  });
});

/**
 * @purpose to get all coupon codes
 *
 * @param req http request
 * @param res http response
 * @param next next function
 *
 * @return void
 */
export const getAllCoupons = TryCatch(async (req, res, next) => {
  const allCoupons = await Coupon.find();

  res.status(200).json({
    success: true,
    coupons: allCoupons,
  });
});

/**
 * @purpose to delete a coupon
 *
 * @param req http request
 * @param res http response
 * @param next next function
 *
 * @return void
 */
export const deleteCoupon = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const deletedCoupon = await Coupon.findByIdAndDelete(id);

  if (!deletedCoupon)
    return next(new ErrorHandler("Coupon Code not exist", 404));

  res.status(200).json({
    success: true,
    message: `Coupon ${deletedCoupon?.couponCode} deleted successfully`,
  });
});
