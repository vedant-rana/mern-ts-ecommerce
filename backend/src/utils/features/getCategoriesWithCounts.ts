import { Product } from "../../models/product.js";

export const getCategoriesWithCount = async ({
  categories,
  productsCount,
}: {
  categories: string[];
  productsCount: number;
}) => {
  //category invaentory percent
  const categoriesCountPromise = categories.map((category) =>
    Product.countDocuments({ category })
  );

  const categoriesCountIndexwise = await Promise.all(categoriesCountPromise);

  const categoryNameAndCount: Record<string, number>[] = [];

  categories.forEach((category, index) => {
    categoryNameAndCount.push({
      [category]: Math.round(
        (categoriesCountIndexwise[index] / productsCount) * 100
      ),
    });
  });

  return categoryNameAndCount;
};
