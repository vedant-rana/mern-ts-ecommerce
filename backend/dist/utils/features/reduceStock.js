import { Product } from "../../models/product.js";
export const reduceStock = async (orderItems) => {
    for (let i = 0; i < orderItems.length; i++) {
        const productInOrder = orderItems[i];
        const product = await Product.findById(productInOrder.productId);
        if (!product)
            throw new Error("Product not found");
        product.stock -= productInOrder.quantity;
        await product.save();
    }
};
