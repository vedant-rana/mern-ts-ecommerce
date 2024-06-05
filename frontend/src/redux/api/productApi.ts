import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllProductResponse } from "../../types/apiTypes";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/products/`,
  }),
  endpoints: (builder) => ({
    latestProducts: builder.query<AllProductResponse, string>({
      query: () => "latest",
    }),
    allProducts: builder.query<AllProductResponse, string>({
      query: (id) => `admin-products?id=${id}`,
    }),
  }),
});

export const { useLatestProductsQuery, useAllProductsQuery } = productApi;
