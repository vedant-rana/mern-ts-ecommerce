import { appCache } from "../app.js";
import { CacheNameStrings } from "./stringConstants/cacheNameStrings.js";
export const revalidateCache = ({ product, order, admin, userId, orderId, productId, }) => {
    if (product) {
        const productKeys = [
            CacheNameStrings.ADMIN_PRODUCTS,
            CacheNameStrings.LATEST_PRODUCTS,
            CacheNameStrings.CATEGORIES,
        ];
        if (typeof productId === "string") {
            productKeys.push(`${CacheNameStrings.SINGLE_PRODUCT}-${productId}`);
        }
        if (typeof productId === "object") {
            productId.forEach((id) => {
                productKeys.push(`${CacheNameStrings.SINGLE_PRODUCT}-${id}`);
            });
        }
        appCache.del(productKeys);
    }
    if (order) {
        const orderKeys = [
            CacheNameStrings.ALL_ORDERS,
            `${CacheNameStrings.MY_ORDERS}-${userId}`,
            `${CacheNameStrings.SINGLE_ORDER}-${orderId}`,
        ];
        appCache.del(orderKeys);
    }
    if (admin) {
        appCache.del([
            CacheNameStrings.ADMIN_STATS,
            CacheNameStrings.PIE_CHARTS,
            CacheNameStrings.LINE_CHARTS,
            CacheNameStrings.BAR_CHARTS,
        ]);
    }
};
