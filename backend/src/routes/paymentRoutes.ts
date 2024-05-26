import express from "express";
import { RouteStrings } from "../utils/stringConstants/routeStrings.js";
import {
  applyDiscount,
  createPaymentIntent,
  deleteCoupon,
  getAllCoupons,
  newCoupon,
} from "../controllers/paymentController.js";
import { adminOnly } from "../middlewares/auth.js";
const router = express.Router();

/**
 * @purpose Create new Discount Coupon
 * @method POST
 * @route /api/v1/payments/create
 */
router.route(RouteStrings.STRIPE_PAYMENT).post(createPaymentIntent);

/**
 * @purpose Create new Discount Coupon
 * @method POST
 * @route /api/v1/payments/coupon/new
 */
router.route(RouteStrings.NEW_COUPON).post(adminOnly, newCoupon);

/**
 * @purpose apply amount of Discount Coupon
 * @method GET
 * @route /api/v1/payments/discount
 */
router.route(RouteStrings.DISCOUNT).get(applyDiscount);

/**
 * @purpose get all Discount Coupons
 * @method GET
 * @route /api/v1/payments/coupon/all
 */
router.route(RouteStrings.ALL_COUPON).get(adminOnly, getAllCoupons);

/**
 * @purpose delete coupon buy id
 * @method DELETE
 * @route /api/v1/payments/coupon/:id
 */
router.route(RouteStrings.SINGLE_COUPON_ID).delete(adminOnly, deleteCoupon);

export default router;
