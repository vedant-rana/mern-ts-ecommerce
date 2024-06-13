import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AllCategoryResponse,
  AllProductResponse,
  CategoriesResponse,
  DeleteCategoryRequest,
  DeleteProductRequest,
  MessageResponse,
  NewCategoryRequest,
  NewProductRequest,
  ProductResponse,
  SearchProductRequest,
  SearchProductResponse,
  UpdateProductRequest,
} from "../../types/apiTypes";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/products/`,
  }),
  tagTypes: ["product", "category"],
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

    updateProduct: builder.mutation<MessageResponse, UpdateProductRequest>({
      query: ({ userId, productId, formData }) => {
        return {
          url: `${productId}?id=${userId}`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: ["product"],
    }),

    deleteProduct: builder.mutation<MessageResponse, DeleteProductRequest>({
      query: ({ userId, productId }) => ({
        url: `${productId}?id=${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["product"],
    }),

    createCategory: builder.mutation<MessageResponse, NewCategoryRequest>({
      query: (data: NewCategoryRequest) => ({
        url: `category/new?id=${data.createdBy}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["category"],
    }),

    adminCategories: builder.query<AllCategoryResponse, string>({
      query: (id) => `category/all?id=${id}`,
      providesTags: ["category"],
    }),

    deleteCategory: builder.mutation<MessageResponse, DeleteCategoryRequest>({
      query: ({ adminId, categoryId }) => ({
        url: `category/${categoryId}?id=${adminId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["category"],
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
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateCategoryMutation,
  useAdminCategoriesQuery,
  useDeleteCategoryMutation,
} = productApi;
