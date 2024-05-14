import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/errorsMiddleware.js";
import { NewProductRequestBody } from "../types/types.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/customError.js";
import { rm } from "fs";

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

    if (!newProduct)
      return next(new ErrorHandler("Product creation failed, try again", 500));

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
    });
  }
);

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
  const latestProducts = await Product.find({})
    .sort({ createdAt: -1 })
    .limit(5);

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
  const latestProducts = await Product.find();

  return res.status(200).json({
    success: true,
    products: latestProducts,
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
  const product = await Product.findById(id);

  return res.status(200).json({
    success: true,
    product,
  });
});

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
  const categories = await Product.distinct("category");

  return res.status(200).json({
    success: true,
    categories,
  });
});
