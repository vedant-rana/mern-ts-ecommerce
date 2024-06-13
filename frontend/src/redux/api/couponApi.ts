import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AllCouponResponse,
  DeleteCouponRequest,
  MessageResponse,
} from "../../types/apiTypes";
import { NewCouponRequest } from "../../types/types";

export const couponApi = createApi({
  reducerPath: "couponApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/payments/coupon/`,
  }),
  tagTypes: ["coupons"],
  endpoints: (builder) => ({
    allCoupons: builder.query<AllCouponResponse, string>({
      query: (id) => `all?id=${id}`,
      providesTags: ["coupons"],
    }),

    createCoupon: builder.mutation<MessageResponse, NewCouponRequest>({
      query: ({ couponData, adminId }) => ({
        url: `new?id=${adminId}`,
        method: "POST",
        body: couponData,
      }),
      invalidatesTags: ["coupons"],
    }),

    deleteCoupon: builder.mutation<MessageResponse, DeleteCouponRequest>({
      query: ({ adminId, couponId }) => ({
        url: `${couponId}?id=${adminId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["coupons"],
    }),
  }),
});

export const {
  useAllCouponsQuery,
  useCreateCouponMutation,
  useDeleteCouponMutation,
} = couponApi;
