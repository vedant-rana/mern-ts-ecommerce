import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/errorsMiddleware.js";
import {
  BaseQueryType,
  NewProductRequestBody,
  SearchRequestQueryType,
} from "../types/types.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/customError.js";
import { rm } from "fs";
import { appCache } from "../app.js";
import { CacheNameStrings } from "../utils/stringConstants/cacheNameStrings.js";
import app from "../routes/userRoutes.js";
import { revalidateCache } from "../utils/revalidateCache.js";

/**
 * @purpose to get latest product as per created at field
 *
 * @param req http request
 * @param res http response
 * @param next next function
 *
 * @return void
 */
export const getLatestProducts = TryCatch(async (req, res, next) => {
  let latestProducts;

  // using appCache instance of node-cache for performance optimization

  //it is required to revalidate these products on
  //creating new product, update and delete and
  //also after placing new order to upate cache eith updated list of proucts
  if (appCache.has(CacheNameStrings.LATEST_PRODUCTS)) {
    latestProducts = JSON.parse(appCache.get("latest-products") as string);
  } else {
    latestProducts = await Product.find().sort({ createdAt: -1 }).limit(5);
    appCache.set(
      CacheNameStrings.LATEST_PRODUCTS,
      JSON.stringify(latestProducts)
    );
  }

  return res.status(200).json({
    success: true,
    products: latestProducts,
  });
});

/**
 * @purpose to get all admin products from DB
 *
 * @param req http request
 * @param res http response
 * @param next next function
 *
 * @return void
 */
export const getAdminProducts = TryCatch(async (req, res, next) => {
  let adminProducts;

  if (appCache.has(CacheNameStrings.ADMIN_PRODUCTS)) {
    adminProducts = JSON.parse(
      appCache.get(CacheNameStrings.ADMIN_PRODUCTS) as string
    );
  } else {
    adminProducts = await Product.find();
    appCache.set(
      CacheNameStrings.ADMIN_PRODUCTS,
      JSON.stringify(adminProducts)
    );
  }

  return res.status(200).json({
    success: true,
    products: adminProducts,
  });
});

/**
 * @purpose to create new product object in MongoDB
 *
 * @param req http request
 * @param res http response
 * @param next next function
 *
 * @return void
 */
export const getSingleProduct = TryCatch(async (req, res, next) => {
  const id = req.params.id;
  let product;

  if (appCache.has(`${CacheNameStrings.SINGLE_PRODUCT}-${id}`)) {
    product = JSON.parse(
      appCache.get(`${CacheNameStrings.SINGLE_PRODUCT}-${id}`) as string
    );
  } else {
    product = await Product.findById(id);
    if (!product) return next(new ErrorHandler(`Product not found`, 404));
    appCache.set(
      `${CacheNameStrings.SINGLE_PRODUCT}-${id}`,
      JSON.stringify(product)
    );
  }

  return res.status(200).json({
    success: true,
    product,
  });
});

/**
 * @purpose to create new product object in MongoDB
 *
 * @param req http request
 * @param res http response
 * @param next next function
 *
 * @return void
 */
export const newProduct = TryCatch(
  async (
    req: Request<{}, {}, NewProductRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, category, stock, price }: NewProductRequestBody = req.body;

    if (!name || !category || !stock || !price) {
      return next(new ErrorHandler("All fields are required", 400));
    }

    const productImage = req.file;
    if (!productImage)
      return next(new ErrorHandler("Product image is required", 400));

    const newProduct = await Product.create({
      name,
      price,
      stock,
      category: category.toLowerCase(),
      photo: productImage?.path,
    });

    // delete all cached products from the cache memory because new product is added
    await revalidateCache({ product: true });

    if (!newProduct)
      return next(new ErrorHandler("Product creation failed, try again", 500));

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
    });
  }
);

/**
 * @purpose to delete a product object in MongoDB
 *
 * @param req http request
 * @param res http response
 * @param next next function
 *
 * @return void
 */
export const deleteProduct = TryCatch(async (req, res, next) => {
  const id = req.params.id;
  let product = await Product.findById(id);

  if (!product) return next(new ErrorHandler("Product id is Invalid", 400));

  if (product.photo) {
    rm(product.photo, () => {
      console.log("old photo deleted");
    });
  }

  const result = await Product.findByIdAndDelete(id);
  if (!result) return next(new ErrorHandler("Failed to delete product", 500));

  // delete all cached products from the cache memory because product is deleted
  await revalidateCache({ product: true, productId: String(product._id) });

  return res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

/**
 * @purpose update a product object in MongoDB
 *
 * @param req http request
 * @param res http response
 * @param next next function
 *
 * @return void
 */
export const updateProductById = TryCatch(async (req, res, next) => {
  const id = req.params.id;
  const { name, category, stock, price }: NewProductRequestBody = req.body;
  const photo = req.file;

  const product = await Product.findById(id);

  if (!product) {
    return next(new ErrorHandler("Invalid Product Id", 404));
  }

  if (photo) {
    rm(product.photo, () => {
      console.log("old photo deleted");
    });
    product.photo = photo.path;
  }

  if (name) product.name = name;
  if (category) product.category = category;
  if (stock) product.stock = stock;
  if (price) product.price = price;

  await product.save();

  // delete all cached products from the cache memory because new product is updated
  await revalidateCache({ product: true, productId: String(product._id) });

  return res.status(200).json({
    success: true,
    message: "Product updated successfully",
  });
});

/**
 * @purpose to get all categories for filter products
 *
 * @param req http request
 * @param res http response
 * @param next next function
 *
 * @return void
 */
export const getAllCategories = TryCatch(async (req, res, next) => {
  let categories;

  if (appCache.has(CacheNameStrings.CATEGORIES)) {
    categories = JSON.parse(
      appCache.get(CacheNameStrings.CATEGORIES) as string
    );
  } else {
    categories = await Product.distinct("category");
    appCache.set(CacheNameStrings.CATEGORIES, JSON.stringify(categories));
  }

  return res.status(200).json({
    success: true,
    categories,
  });
});

/**
 * @purpose to get all products for all users
 *
 * @param req http request
 * @param res http response
 * @param next next function
 *
 * @return void
 */
export const getAllProducts = TryCatch(
  async (req: Request<{}, {}, {}, SearchRequestQueryType>, res, next) => {
    const { search, sort, category, price } = req.query;

    const pageNo = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (pageNo - 1) * limit;

    const baseQuery: BaseQueryType = {};

    if (search) {
      baseQuery.name = {
        $regex: search,
        $options: "i",
      };
    }

    if (price) {
      baseQuery.price = {
        $lte: Number(price),
      };
    }

    if (category) {
      baseQuery.category = category;
    }

    const [products, filteredOnlyProducts] = await Promise.all([
      Product.find(baseQuery)
        .sort(sort && { price: sort === "asc" ? 1 : -1 })
        .limit(limit)
        .skip(skip),
      Product.find(baseQuery),
    ]);

    const totalPage = Math.ceil(filteredOnlyProducts.length / limit);

    return res.status(200).json({
      success: true,
      products,
      totalPage,
    });
  }
);
