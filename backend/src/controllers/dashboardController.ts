import { appCache } from "../app.js";
import { TryCatch } from "../middlewares/errorsMiddleware.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import { CacheNameStrings } from "../utils/stringConstants/cacheNameStrings.js";

/**
 * @purpose to get stats of dashboard
 *
 * @param req http request
 * @param res http response
 * @param next next function
 *
 * @return void
 */
export const getDashboardStats = TryCatch(async (req, res, next) => {
  let stats = {};

  if (appCache.has(CacheNameStrings.ADMIN_STATS)) {
    stats = JSON.parse(appCache.get(CacheNameStrings.ADMIN_STATS) as string);
  } else {
    // first we calculate the the dates of current Months first day, cuurent day, last months first day adn last day to calculate the difference between both months stats
    const today = new Date();

    const currentMonth = {
      start: new Date(today.getFullYear(), today.getMonth(), 1),
      end: today,
    };

    const lastMonth = {
      start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
      end: new Date(today.getFullYear(), today.getMonth(), 0),
    };

    const currentMonthsProductsPromise = Product.find({
      createdAt: {
        $gte: currentMonth.start,
        $lte: currentMonth.end,
      },
    });

    const lastMonthsProductsPromise = Product.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    const currentMonthsUsersPromise = User.find({
      createdAt: {
        $gte: currentMonth.start,
        $lte: currentMonth.end,
      },
    });

    const lastMonthsUsersPromise = User.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    const currentMonthsOrdersPromise = Order.find({
      createdAt: {
        $gte: currentMonth.start,
        $lte: currentMonth.end,
      },
    });

    const lastMonthsOrdersPromise = Order.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });
  }

  res.status(200).json({
    success: true,
    stats,
  });
});

/**
 * @purpose to get all orders of user
 *
 * @param req http request
 * @param res http response
 * @param next next function
 *
 * @return void
 */
export const getPieCharts = TryCatch(async () => {});

/**
 * @purpose to get all orders of user
 *
 * @param req http request
 * @param res http response
 * @param next next function
 *
 * @return void
 */
export const getBarCharts = TryCatch(async () => {});

/**
 * @purpose to get all orders of user
 *
 * @param req http request
 * @param res http response
 * @param next next function
 *
 * @return void
 */
export const getLineCharts = TryCatch(async () => {});
