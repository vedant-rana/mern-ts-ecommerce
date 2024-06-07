import express from "express";
import { RouteStrings } from "../utils/stringConstants/routeStrings.js";
import { singleUpload } from "../middlewares/multer.js";
import { deleteProduct, getAdminProducts, getAllCategories, getAllProducts, getLatestProducts, getSingleProduct, newProduct, updateProductById, } from "../controllers/productController.js";
import { adminOnly } from "../middlewares/auth.js";
const router = express.Router();
/**
 * @purpose Create new Product
 * @method POST
 * @route /api/v1/products/new
 */
router
    .route(RouteStrings.NEW_PRODUCT)
    .post(adminOnly, singleUpload, newProduct);
/**
 * @purpose get all admin product details
 * @method GET
 * @route /api/v1/products/admin-products
 */
router.route(RouteStrings.ADMIN_PRODUCT).get(adminOnly, getAdminProducts);
/**
 * @purpose get all product details with filter and search
 * @method GET
 * @route /api/v1/products/all
 */
router.route(RouteStrings.ALL_PRODUCTS).get(getAllProducts);
/**
 * @purpose get latest products
 * @method GET
 * @route /api/v1/products/latest
 */
router.route(RouteStrings.LATEST_PRODUCTS).get(getLatestProducts);
/**
 * @purpose get all distinct categories of products
 * @method GET
 * @route /api/v1/prducts/categories
 */
router.route(RouteStrings.PRODUCT_CATEGORIES).get(getAllCategories);
/**
 * @purpose get a single Product details
 * @method GET
 * @route /api/v1/products/:id
 */
router.route(RouteStrings.SINGLE_PRODUCT_ID).get(getSingleProduct);
/**
 * @purpose update a single Product with _id
 * @method PUT
 * @route /api/v1/products/:id
 */
router
    .route(RouteStrings.SINGLE_PRODUCT_ID)
    .put(adminOnly, singleUpload, updateProductById);
/**
 * @purpose delete a Product (admin only)
 * @method DELETE
 * @route /api/v1/prducts/:id
 */
router.route(RouteStrings.SINGLE_PRODUCT_ID).delete(adminOnly, deleteProduct);
export default router;
