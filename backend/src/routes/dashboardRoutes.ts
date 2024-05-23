import express = require("express");
import { RouteStrings } from "../utils/stringConstants/routeStrings.js";
import {
  getBarCharts,
  getDashboardStats,
  getLineCharts,
  getPieCharts,
} from "../controllers/dashboardController.js";
import { adminOnly } from "../middlewares/auth.js";

const router = express.Router();

/**
 * @purpose get all data for stats
 * @method GET
 * @route /api/v1/dashboard/stats
 */
router.route(RouteStrings.DASHBOARD_STATS).get(adminOnly, getDashboardStats);

/**
 * @purpose get all data for pie charts
 * @method GET
 * @route /api/v1/dashboard/pie
 */
router.route(RouteStrings.DASHBOARD_PIE).get(adminOnly, getPieCharts);

/**
 * @purpose get all data for bar charts
 * @method GET
 * @route /api/v1/dashboard/bar
 */
router.route(RouteStrings.DASHBOARD_BAR).get(adminOnly, getBarCharts);

/**
 * @purpose get all data for line charts
 * @method GET
 * @route /api/v1/dashboard/line
 */
router.route(RouteStrings.DASHBOARD_LINE).get(adminOnly, getLineCharts);

export default router;
