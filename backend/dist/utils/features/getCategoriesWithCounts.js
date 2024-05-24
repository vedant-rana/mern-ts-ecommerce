import { Product } from "../../models/product.js";
export const getCategoriesWithCount = async ({ categories, productsCount, }) => {
    //category invaentory percent
    const categoriesCountPromise = categories.map((category) => Product.countDocuments({ category }));
    const categoriesCountIndexwise = await Promise.all(categoriesCountPromise);
    const categoryNameAndCount = [];
    categories.forEach((category, index) => {
        categoryNameAndCount.push({
            [category]: Math.round((categoriesCountIndexwise[index] / productsCount) * 100),
        });
    });
    return categoryNameAndCount;
};
