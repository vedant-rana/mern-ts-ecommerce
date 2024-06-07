import { ICartItem, IUser, ShippingInfo } from "./types";

export interface UserReducerInitialState {
  user: IUser | null;
  loading: boolean;
}

export interface CartReducerInitialState {
  loading: boolean;
  cartItems: ICartItem[];
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  shippingInfo: ShippingInfo;
}
