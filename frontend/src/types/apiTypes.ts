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
