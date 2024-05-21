import { appCache } from "../app.js";
import { Product } from "../models/product.js";
import { CacheNameStrings } from "./cacheNameStrings.js";
export const revalidateCache = async ({ product, order, admin, }) => {
    if (product) {
        const productKeys = [
            CacheNameStrings.ADMIN_PRODUCTS,
            CacheNameStrings.LATEST_PRODUCTS,
            CacheNameStrings.CATEGORIES,
        ];
        const productsStoredInCache = await Product.find().select("_id");
        productsStoredInCache.forEach((product) => {
            productKeys.push(`${CacheNameStrings.SINGLE_PRODUCT}-${product._id}`);
        });
        appCache.del(productKeys);
    }
    if (order) {
        console.log("order cache revalidated");
    }
    if (admin) {
        console.log("admin cache revalidated");
    }
};
