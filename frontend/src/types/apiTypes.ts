import { IProduct, IUser } from "./types";

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
