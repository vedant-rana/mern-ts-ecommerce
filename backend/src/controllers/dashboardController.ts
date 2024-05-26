import { appCache } from "../app.js";
import { TryCatch } from "../middlewares/errorsMiddleware.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import { calculatePercentage } from "../utils/features/calculatePercentage.js";
import { getCategoriesWithCount } from "../utils/features/getCategoriesWithCounts.js";
import { lastMonthsData } from "../utils/features/lastMonthsData.js";
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
    const sixMonthAgo = new Date();

    sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);

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

    const lastSixMonthsOrdersPromise = Order.find({
      createdAt: {
        $gte: sixMonthAgo,
        $lte: today,
      },
    });

    const latestTransactionsPromise = Order.find({})
      .select(["orderItems", "discount", "total", "status"])
      .limit(4);

    const [
      currentMonthsProducts,
      currentMonthsUsers,
      currentMonthsOrders,
      lastMonthsProducts,
      lastMonthsUsers,
      lastMonthsOrders,
      productsCount,
      usersCount,
      allOrders,
      lastSixMonthsOrders,
      categories,
      femaleUserCount,
      latestTransactions,
    ] = await Promise.all([
      currentMonthsProductsPromise,
      currentMonthsUsersPromise,
      currentMonthsOrdersPromise,
      lastMonthsProductsPromise,
      lastMonthsUsersPromise,
      lastMonthsOrdersPromise,
      Product.countDocuments(),
      User.countDocuments(),
      Order.find({}).select("total"),
      lastSixMonthsOrdersPromise,
      Product.distinct("category"),
      User.countDocuments({ gender: "female" }),
      latestTransactionsPromise,
    ]);

    const currentMonthRevenue = currentMonthsOrders.reduce(
      (total, order) => total + (order.total || 0),
      0
    );

    const lastMonthRevenue = lastMonthsOrders.reduce(
      (total, order) => total + (order.total || 0),
      0
    );

    const changePercent = {
      revenue: calculatePercentage(currentMonthRevenue, lastMonthRevenue),
      product: calculatePercentage(
        currentMonthsProducts.length,
        lastMonthsProducts.length
      ),
      user: calculatePercentage(
        currentMonthsUsers.length,
        lastMonthsUsers.length
      ),
      order: calculatePercentage(
        currentMonthsOrders.length,
        lastMonthsOrders.length
      ),
    };

    const revenue = allOrders.reduce(
      (total, order) => total + (order.total || 0),
      0
    );

    const counts = {
      revenue,
      user: usersCount,
      product: productsCount,
      order: allOrders.length,
    };

    const monthlyOrderCounts = new Array(6).fill(0);
    const monthlyOrderRevenue = new Array(6).fill(0);

    lastSixMonthsOrders.forEach((order) => {
      const creationDate: Date = order.createdAt;
      const monthDiff: number =
        (today.getMonth() - creationDate.getMonth() + 12) % 12;
      if (monthDiff < 6) {
        monthlyOrderCounts[6 - monthDiff - 1] += 1;
        monthlyOrderRevenue[6 - monthDiff - 1] += order.total;
      }
    });

    //category invaentory percent
    const categoryNameAndCount: Record<string, number>[] =
      await getCategoriesWithCount({ categories, productsCount });

    const userRatio = {
      male: usersCount - femaleUserCount,
      female: femaleUserCount,
    };

    const modifiedLatestTransactions = latestTransactions.map(
      (transaction) => ({
        _id: transaction._id,
        discount: transaction.discount,
        amount: transaction.total,
        orderItems: transaction.orderItems.length,
        status: transaction.status,
      })
    );

    stats = {
      categoryCount: categoryNameAndCount,
      changePercent,
      counts,
      chart: {
        order: monthlyOrderCounts,
        revenue: monthlyOrderRevenue,
      },
      userRatio,
      latestTransactions: modifiedLatestTransactions,
    };

    appCache.set(CacheNameStrings.ADMIN_STATS, JSON.stringify(stats));
  }

  res.status(200).json({
    success: true,
    stats,
  });
});

/**
 * @purpose to get data for pie charts
 *
 * @param req http request
 * @param res http response
 * @param next next function
 *
 * @return void
 */
export const getPieCharts = TryCatch(async (req, res, next) => {
  let pieCharts;

  if (appCache.has(CacheNameStrings.PIE_CHARTS)) {
    pieCharts = JSON.parse(appCache.get(CacheNameStrings.PIE_CHARTS) as string);
  } else {
    const allOrdersPromise = Order.find({}).select([
      "total",
      "discount",
      "subtotal",
      "tax",
      "shippingCharges",
    ]);
    const [
      processingOrders,
      shippedOrders,
      deliveredOrders,
      categories,
      productsCount,
      productsOutOfStock,
      allOrders,
      allUsers,
      adminUsers,
      customerUsers,
    ] = await Promise.all([
      Order.countDocuments({ status: "Processing" }),
      Order.countDocuments({ status: "Shipped" }),
      Order.countDocuments({ status: "Delivered" }),
      Product.distinct("category"),
      Product.countDocuments(),
      Product.countDocuments({ stock: 0 }),
      allOrdersPromise,
      User.find({}).select(["dob"]),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ role: "user" }),
    ]);

    const orderFullfillment = {
      processing: processingOrders,
      shipped: shippedOrders,
      delivered: deliveredOrders,
    };

    const categoryCount = await getCategoriesWithCount({
      categories,
      productsCount,
    });

    const stockAvailibility = {
      inStock: productsCount - productsOutOfStock,
      outOfStock: productsOutOfStock,
    };

    const grossIncome = allOrders.reduce(
      (prev, order) => prev + (order.total || 0),
      0
    );
    const discount = allOrders.reduce(
      (prev, order) => prev + (order.discount || 0),
      0
    );
    const productionCost = allOrders.reduce(
      (prev, order) => prev + (order.shippingCharges || 0),
      0
    );
    const burnt = allOrders.reduce((prev, order) => prev + (order.tax || 0), 0);
    const marketingCost = Math.round(grossIncome * (30 / 100));
    const netMargin =
      grossIncome - discount - productionCost - burnt - marketingCost;

    const revenueDistribution = {
      netMargin,
      discount,
      productionCost,
      burnt,
      marketingCost,
    };

    const usersAgeGroup = {
      teen: allUsers.filter((i) => i.age < 20).length,
      adult: allUsers.filter((i) => i.age >= 20 && i.age < 40).length,
      old: allUsers.filter((i) => i.age > 40).length,
    };

    const adminCustomers = {
      admin: adminUsers,
      customer: customerUsers,
    };

    pieCharts = {
      orderFullfillment,
      pouductCategories: categoryCount,
      stockAvailibility,
      revenueDistribution,
      adminUsers,
      usersAgeGroup,
      adminCustomers,
    };

    appCache.set(CacheNameStrings.PIE_CHARTS, JSON.stringify(pieCharts));
  }

  return res.status(200).json({
    success: true,
    charts: pieCharts,
  });
});

/**
 * @purpose to get data for bar charts
 *
 * @param req http request
 * @param res http response
 * @param next next function
 *
 * @return void
 */
export const getBarCharts = TryCatch(async (req, res, next) => {
  let barCharts;

  if (appCache.has(CacheNameStrings.BAR_CHARTS)) {
    barCharts = JSON.parse(appCache.get(CacheNameStrings.BAR_CHARTS) as string);
  } else {
    const today = new Date();

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const lastSixMonthsProductsPromise = Product.find({
      createdAt: {
        $gte: sixMonthsAgo,
        $lte: today,
      },
    }).select("createdAt");
    const lastSixMonthsUsersPromise = User.find({
      createdAt: {
        $gte: sixMonthsAgo,
        $lte: today,
      },
    }).select("createdAt");
    const lastTwelveMonthsOrdersPromise = Order.find({
      createdAt: {
        $gte: twelveMonthsAgo,
        $lte: today,
      },
    }).select("createdAt");

    const [lastSixMonthsProducts, lastSixMonthsUsers, lastTwelveMonthsOrders] =
      await Promise.all([
        lastSixMonthsProductsPromise,
        lastSixMonthsUsersPromise,
        lastTwelveMonthsOrdersPromise,
      ]);

    const productsCount = lastMonthsData({
      length: 6,
      today,
      docArr: lastSixMonthsProducts,
    });
    const usersCount = lastMonthsData({
      length: 6,
      today,
      docArr: lastSixMonthsUsers,
    });
    const ordersCount = lastMonthsData({
      length: 12,
      today,
      docArr: lastTwelveMonthsOrders,
    });
    barCharts = {
      users: usersCount,
      products: productsCount,
      orders: ordersCount,
    };

    appCache.set(CacheNameStrings.BAR_CHARTS, JSON.stringify(barCharts));
  }

  return res.status(200).json({
    success: true,
    charts: barCharts,
  });
});

/**
 * @purpose to get line charts data
 *
 * @param req http request
 * @param res http response
 * @param next next function
 *
 * @return void
 */
export const getLineCharts = TryCatch(async (req, res, next) => {
  let barCharts;

  if (appCache.has(CacheNameStrings.LINE_CHARTS)) {
    barCharts = JSON.parse(
      appCache.get(CacheNameStrings.LINE_CHARTS) as string
    );
  } else {
    const today = new Date();

    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const baseQuery = {
      createdAt: {
        $gte: twelveMonthsAgo,
        $lte: today,
      },
    };

    const [lastSixMonthsProducts, lastSixMonthsUsers, lastTwelveMonthsOrders] =
      await Promise.all([
        Product.find(baseQuery).select("createdAt"),
        User.find(baseQuery).select("createdAt"),
        Order.find(baseQuery).select(["createdAt", "discount", "total"]),
      ]);

    const productsCount = lastMonthsData({
      length: 12,
      today,
      docArr: lastSixMonthsProducts,
    });
    const usersCount = lastMonthsData({
      length: 12,
      today,
      docArr: lastSixMonthsUsers,
    });
    const discountCount = lastMonthsData({
      length: 12,
      today,
      docArr: lastTwelveMonthsOrders,
      property: "discount",
    });
    const revenueCount = lastMonthsData({
      length: 12,
      today,
      docArr: lastTwelveMonthsOrders,
      property: "total",
    });
    barCharts = {
      users: usersCount,
      products: productsCount,
      discount: discountCount,
      revenue: revenueCount,
    };

    appCache.set(CacheNameStrings.LINE_CHARTS, JSON.stringify(barCharts));
  }

  return res.status(200).json({
    success: true,
    charts: barCharts,
  });
});
