import express from "express";

//Initializing express app
const app = express();

/**
 * middlewares
 */
app.use(express.json());

//Mongodb connection function
connectMongoDB();

/**
 * importing Routes for accessing routes functions
 */
import userRoutes from "./routes/userRoutes.js";
import { RouteStrings } from "./utils/RouteStrings.js";
import { connectMongoDB } from "./utils/databaseConnection.js";
import { errorMiddleware } from "./middlewares/errorsMiddleware.js";

//routes with endpoints
app.use(RouteStrings.USER_BASE_URL, userRoutes);

//Error handling Middleware
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
