import express from "express";
import morgan from "morgan";
//Initializing express app
const app = express();
/**
 * middlewares
 */
app.use(express.json());
//morgan will log the request to the server on console
app.use(morgan("dev"));
// configuriing env for app
import { config } from "dotenv";
config({
    path: "./.env",
});
//accessing environment variables for app
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || "";
//Mongodb connection function
import { connectMongoDB } from "./utils/databaseConnection.js";
connectMongoDB(MONGODB_URI);
//Applying caching in api using node-cache module
import NodeCache from "node-cache";
export const appCache = new NodeCache();
/**
 * importing Routes for accessing routes functions
 */
import { RouteStrings } from "./utils/stringConstants/routeStrings.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoute.js";
import orderRoutes from "./routes/orderRoutes.js";
//routes with endpoints
app.use(RouteStrings.USER_BASE_URL, userRoutes);
app.use(RouteStrings.PRODUCT_BASE_URL, productRoutes);
app.use(RouteStrings.ORDER_BASE_URL, orderRoutes);
//making uploads folder available to users as static
app.use("/uploads", express.static("uploads"));
//Error handling Middleware
import { errorMiddleware } from "./middlewares/errorsMiddleware.js";
app.use(errorMiddleware);
/**
 * PORT and Server configuration
 */
// listen function for server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
