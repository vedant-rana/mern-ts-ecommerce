import express from "express";
//Initializing express app
const app = express();
/**
 * middlewares
 */
app.use(express.json());
//Mongodb connection function
import { connectMongoDB } from "./utils/databaseConnection.js";
connectMongoDB();
//Applying caching in api using node-cache module
import NodeCache from "node-cache";
export const appCache = new NodeCache();
/**
 * importing Routes for accessing routes functions
 */
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoute.js";
import { RouteStrings } from "./utils/routeStrings.js";
//routes with endpoints
app.use(RouteStrings.USER_BASE_URL, userRoutes);
app.use(RouteStrings.PRODUCT_BASE_URL, productRoutes);
//making uploads folder available to users as static
app.use("/uploads", express.static("uploads"));
//Error handling Middleware
import { errorMiddleware } from "./middlewares/errorsMiddleware.js";
app.use(errorMiddleware);
/**
 * PORT and Server configuration
 */
//PORT on which app will be run
const PORT = process.env.PORT || 4000;
// listen function for server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
