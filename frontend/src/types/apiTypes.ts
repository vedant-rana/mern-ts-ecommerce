import {
  IBar,
  ICartItem,
  ICategory,
  ICoupon,
  ILine,
  IOrder,
  IPie,
  IProduct,
  IStat,
  IUser,
  ShippingInfo,
} from "./types";

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

export type AllUsersResponse = {
  success: boolean;
  users: IUser[];
};

export type UserResponse = {
  success: boolean;
  user: IUser;
};

export type AllProductResponse = {
  success: boolean;
  products: IProduct[];
};

export type AllCouponResponse = {
  success: boolean;
  coupons: ICoupon[];
};

export type AllCategoryResponse = {
  success: boolean;
  categories: ICategory[];
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

export type StatsResponse = {
  success: boolean;
  stats: IStat;
};

export type PieResponse = {
  success: boolean;
  charts: IPie;
};

export type BarResponse = {
  success: boolean;
  charts: IBar;
};

export type LineResponse = {
  success: boolean;
  charts: ILine;
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

export type NewCategoryRequest = {
  name: string;
  createdBy: string;
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

export type DeleteUserRequest = {
  userId: string; // user id
  adminUserId: string; // admin id
};

export type DeleteCouponRequest = {
  adminId: string; // admin id
  couponId: string; // coupon id
};

export type DeleteCategoryRequest = {
  adminId: string; // admin id
  categoryId: string; // category id
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
