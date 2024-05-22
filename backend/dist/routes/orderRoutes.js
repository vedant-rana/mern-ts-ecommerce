import express from "express";
import { newOrder, myOrders, allOrders, getSingleOrder, processOrder, deleteOrder, } from "../controllers/orderController.js";
import { RouteStrings } from "../utils/stringConstants/routeStrings.js";
import { adminOnly } from "../middlewares/auth.js";
const router = express.Router();
/**
 * @purpose Create new Order
 * @method POST
 * @route /api/v1/orders/new
 */
router.route(RouteStrings.NEW_ORDER).post(newOrder);
/**
 * @purpose get single users all orders
 * @method GET
 * @route /api/v1/orders/my
 */
router.route(RouteStrings.MY_ORDERS).get(myOrders);
/**
 * @purpose get all orders (admin only)
 * @method GET
 * @route /api/v1/orders/all
 */
router.route(RouteStrings.ALL_ORDERS).get(adminOnly, allOrders);
/**
 * @purpose get single order details
 * @method GET
 * @route /api/v1/orders/:id
 */
router.route(RouteStrings.SINGLE_ORDER_ID).get(getSingleOrder);
/**
 * @purpose update order status
 * @method PUT
 * @route /api/v1/orders/:id
 */
router.route(RouteStrings.SINGLE_ORDER_ID).put(adminOnly, processOrder);
/**
 * @purpose delete order
 * @method DELETE
 * @route /api/v1/orders/:id
 */
router.route(RouteStrings.SINGLE_ORDER_ID).delete(adminOnly, deleteOrder);
export default router;
