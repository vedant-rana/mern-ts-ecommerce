import { ICartItem, IOrder, IProduct, IUser, ShippingInfo } from "./types";

export type CustomError = {
  status: number;
  data: {
    message: string;
    success: boolean;
  };
};

export type MessageResponse = {
  success: boolean;
  message: string;
};
export type UserResponse = {
  success: boolean;
  user: IUser;
};

export type AllProductResponse = {
  success: boolean;
  products: IProduct[];
};

export type ProductResponse = {
  success: boolean;
  product: IProduct;
};

export type CategoriesResponse = {
  success: boolean;
  categories: string[];
};

export type SearchProductResponse = AllProductResponse & {
  totalPage: number;
};

export type SearchProductRequest = {
  search: string;
  price: number;
  category: string;
  page: number;
  sort: string;
};

export type NewProductRequest = {
  id: string; // admin id
  formData: FormData;
};

export type UpdateProductRequest = {
  userId: string; // admin id
  productId: string; // admin product
  formData: FormData;
};

export type DeleteProductRequest = {
  userId: string; // admin id
  productId: string; // admin product
};

export type NewOrderRequest = {
  shippingInfo: ShippingInfo;
  orderItems: ICartItem[];
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  user: string;
};

export type UpdateOrderRequest = {
  orderId: string;
  userId: string;
};

export type AllOrdersResponse = {
  success: boolean;
  orders: IOrder[];
};

export type OrderDetailsResponse = {
  success: boolean;
  order: IOrder;
};
