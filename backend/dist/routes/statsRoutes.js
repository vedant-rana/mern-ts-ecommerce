import { createRequire as _createRequire } from "module";
const __require = _createRequire(import.meta.url);
const express = __require("express");
import { RouteStrings } from "../utils/stringConstants/routeStrings.js";
const router = express.Router();
/**
 * @purpose get all data for stats
 * @method GET
 * @route /api/v1/dashboard/stats
 */
router.route(RouteStrings.DASHBOARD_STATS).get();
/**
 * @purpose get all data for pie charts
 * @method GET
 * @route /api/v1/dashboard/pie
 */
router.route(RouteStrings.DASHBOARD_PIE).get();
/**
 * @purpose get all data for bar charts
 * @method GET
 * @route /api/v1/dashboard/bar
 */
router.route(RouteStrings.DASHBOARD_BAR).get();
/**
 * @purpose get all data for line charts
 * @method GET
 * @route /api/v1/dashboard/line
 */
router.route(RouteStrings.DASHBOARD_LINE).get();
export default router;
