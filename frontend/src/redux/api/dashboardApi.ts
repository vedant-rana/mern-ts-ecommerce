import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { PieResponse, StatsResponse } from "../../types/apiTypes";

export const dashboardApi = createApi({
  reducerPath: "dasboardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/dashboard/`,
  }),
  endpoints: (builder) => ({
    statsData: builder.query<StatsResponse, string>({
      query: (id) => `stats?id=${id}`,
    }),
    pieChartData: builder.query<PieResponse, string>({
      query: (id) => `pie?id=${id}`,
    }),
    lineChartData: builder.query<string, string>({
      query: (id) => `line?id=${id}`,
    }),
    barChartData: builder.query<string, string>({
      query: (id) => `bar?id=${id}`,
    }),
  }),
});

export const {
  useStatsDataQuery,
  useBarChartDataQuery,
  usePieChartDataQuery,
  useLineChartDataQuery,
} = dashboardApi;
