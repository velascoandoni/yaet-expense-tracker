import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseURL } from "../../CONSTS";
import type { CreateExpenseType, ExpenseType } from "../../../../types/types"

export const expenseTypesApi = createApi({
  reducerPath: 'expensesTypeApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${baseURL}/expenseTypes` }),
  tagTypes: ['ExpenseType'], // Optional: for cache invalidation
  endpoints: (build) => ({
    getExpenseTypes: build.query<ExpenseType[], undefined>({
      query: () => ({
        url: ``,
        method: "GET",

      }),
      providesTags: ['ExpenseType'],

    }),
    createExpenseType: build.mutation<ExpenseType, CreateExpenseType>({
      query: ({ color, name, emoji,text_color }) => ({
        url: "",
        method: "POST",
        body: { color, name, emoji,text_color },
      }),
      invalidatesTags: ['ExpenseType'],

    }),
    updateExpenseType: build.mutation<ExpenseType, ExpenseType>({
      query: ({ type_id,color, name, emoji,text_color }) => ({
        url: "",
        method: "PUT",
        body: { type_id,color, name, emoji,text_color },
      }),
      invalidatesTags: ['ExpenseType'],

    }),
  }),
});

// Export hooks for usage in components
export const { useGetExpenseTypesQuery, useCreateExpenseTypeMutation,useUpdateExpenseTypeMutation } = expenseTypesApi;
