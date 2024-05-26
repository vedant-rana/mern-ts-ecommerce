import { TryCatch } from "../middlewares/errorsMiddleware.js";
import { Order } from "../models/order.js";
import { reduceStock } from "../utils/features/reduceStock.js";
import { revalidateCache } from "../utils/revalidateCache.js";
import ErrorHandler from "../utils/customError.js";
import { appCache } from "../app.js";
import { CacheNameStrings } from "../utils/stringConstants/cacheNameStrings.js";
/**
 * @purpose to get all orders of user
 *
 * @param req http request
 * @param res http response
 * @param next next function
 *
 * @return void
 */
export const myOrders = TryCatch(async (req, res, next) => {
    const { id: user } = req.query;
    if (!user)
        return next(new ErrorHandler("Please Login to get all orders", 400));
    const myOrderCacheName = `${CacheNameStrings.MY_ORDERS}-${user}`;
    let orders = [];
    if (appCache.has(myOrderCacheName)) {
        console.log("in the if block");
        orders = JSON.parse(appCache.get(myOrderCacheName));
    }
    else {
        console.log("in the else block");
        orders = await Order.find({ user });
        appCache.set(myOrderCacheName, JSON.stringify(orders));
    }
    return res.status(200).json({
        success: true,
        orders,
    });
});
/**
 * @purpose to get all orders of all users (admin only)
 *
 * @param req http request
 * @param res http response
 * @param next next function
 *
 * @return void
 */
export const allOrders = TryCatch(async (req, res, next) => {
    let orders = [];
    if (appCache.has(CacheNameStrings.ALL_ORDERS)) {
        console.log("in the if block");
        orders = JSON.parse(appCache.get(CacheNameStrings.ALL_ORDERS));
    }
    else {
        console.log("in the else block");
        orders = await Order.find({}).populate("user", "name");
        appCache.set(CacheNameStrings.ALL_ORDERS, JSON.stringify(orders));
    }
    return res.status(200).json({
        success: true,
        orders,
    });
});
/**
 * @purpose to get all orders of all users (admin only)
 *
 * @param req http request
 * @param res http response
 * @param next next function
 *
 * @return void
 */
export const getSingleOrder = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    if (!id)
        return next(new ErrorHandler("Order id is Invalid", 400));
    const myOrderCacheName = `${CacheNameStrings.SINGLE_ORDER}-${id}`;
    let order;
    if (appCache.has(myOrderCacheName)) {
        order = JSON.parse(appCache.get(myOrderCacheName));
    }
    else {
        order = await Order.findById(id).populate("user", "name");
        if (!order)
            return next(new ErrorHandler("Order Not Found", 404));
        appCache.set(myOrderCacheName, JSON.stringify(order));
    }
    return res.status(200).json({
        success: true,
        order,
    });
});
/**
 * @purpose to create a new order with users address, products name,
 * price and quantity
 *
 * @param req http request
 * @param res http response
 * @param next next function
 *
 * @return void
 */
export const newOrder = TryCatch(async (req, res, next) => {
    const { shippingInfo, orderItems, user, subtotal, tax, shippingCharges, discount, total, } = req.body;
    if (!shippingInfo || !orderItems || !user || !subtotal || !tax || !total) {
        return next(new ErrorHandler("All fields are required", 400));
    }
    const order = await Order.create({
        shippingInfo,
        orderItems,
        user,
        subtotal,
        tax,
        shippingCharges,
        discount,
        total,
    });
    //updating the stock of products by reducing
    //the quantity of that products in order
    await reduceStock(orderItems);
    //updating caches
    revalidateCache({
        product: true,
        order: true,
        admin: true,
        userId: user,
        productId: order.orderItems.map((item) => String(item.productId)),
    });
    return res.status(201).json({
        success: true,
        message: "Order placed successfully",
    });
});
/**
 * @purpose to update order status between "Processing", "Shipped", "Delivered"
 *
 * @param req http request
 * @param res http response
 * @param next next function
 *
 * @return void
 */
export const processOrder = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order)
        return next(new ErrorHandler("Order not found", 404));
    switch (order.status) {
        case "Processing":
            order.status = "Shipped";
            break;
        case "Shipped":
            order.status = "Delivered";
            break;
        default:
            order.status = "Delivered";
            break;
    }
    await order.save();
    revalidateCache({
        product: false,
        order: true,
        admin: true,
        userId: order.user,
        orderId: String(order._id), // will delete perticular cached order which has id in its cachename because it is updated
    });
    return res.status(201).json({
        success: true,
        message: "Order status updated successfully",
    });
});
/**
 * @purpose to delete order
 *
 * @param req http request
 * @param res http response
 * @param next next function
 *
 * @return void
 */
export const deleteOrder = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order)
        return next(new ErrorHandler("Order not found", 404));
    await order.deleteOne();
    revalidateCache({
        product: false,
        order: true,
        admin: true,
        userId: order.user,
        orderId: String(order._id),
    });
    return res.status(201).json({
        success: true,
        message: "Order Deleted successfully",
    });
});
