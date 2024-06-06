import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AllProductResponse,
  CategoriesResponse,
  MessageResponse,
  NewProductRequest,
  ProductResponse,
  SearchProductRequest,
  SearchProductResponse,
} from "../../types/apiTypes";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/products/`,
  }),
  tagTypes: ["product"],
  endpoints: (builder) => ({
    latestProducts: builder.query<AllProductResponse, string>({
      query: () => "latest",
      providesTags: ["product"],
    }),

    allProducts: builder.query<AllProductResponse, string>({
      query: (id) => `admin-products?id=${id}`,
      providesTags: ["product"],
    }),

    categories: builder.query<CategoriesResponse, string>({
      query: () => "categories",
      providesTags: ["product"],
    }),

    searchProducts: builder.query<SearchProductResponse, SearchProductRequest>({
      query: ({ price, search, sort, category, page }) => {
        let filterQuery = `all?search=${search}&page=${page}`;
        if (price) filterQuery += `&price=${price}`;
        if (category) filterQuery += `&category=${category}`;
        if (sort) filterQuery += `&sort=${sort}`;

        return filterQuery;
      },
      providesTags: ["product"],
    }),

    createProduct: builder.mutation<MessageResponse, NewProductRequest>({
      query: ({ id, formData }) => ({
        url: `new?id=${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["product"],
    }),

    productDetails: builder.query<ProductResponse, string>({
      query: (id) => id,
      providesTags: ["product"],
    }),
  }),
});

export const {
  useLatestProductsQuery,
  useAllProductsQuery,
  useCategoriesQuery,
  useSearchProductsQuery,
  useCreateProductMutation,
  useProductDetailsQuery,
} = productApi;
