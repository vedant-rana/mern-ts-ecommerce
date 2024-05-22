import { appCache } from "../app.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { InavlidateCacheType } from "../types/types.js";
import { CacheNameStrings } from "./stringConstants/cacheNameStrings.js";

export const revalidateCache = async ({
  product,
  order,
  admin,
  userId,
  orderId,
  productId,
}: InavlidateCacheType) => {
  if (product) {
    const productKeys: string[] = [
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
    const orderKeys: string[] = [
      CacheNameStrings.ALL_ORDERS,
      `${CacheNameStrings.MY_ORDERS}-${userId}`,
      `${CacheNameStrings.SINGLE_ORDER}-${orderId}`,
    ];

    appCache.del(orderKeys);
  }
  if (admin) {
    console.log("admin cache revalidated");
  }
};
