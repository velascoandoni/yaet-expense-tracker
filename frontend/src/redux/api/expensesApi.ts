import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseURL } from "../../CONSTS";
import type { Expense, CreateExpense } from "../../../../types/expenses"
import { useDispatch } from 'react-redux';
import { clearActiveQuery, setActiveQuery } from '../slices/ActiveQuerySlice';
export const expensesApi = createApi({
  reducerPath: 'expensesApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${baseURL}/expenses` }),
  tagTypes: ['Expense'], // Optional: for cache invalidation
  endpoints: (build) => ({
    getExpensesByUser: build.query<Expense[], any>({
      query: (query) => ({
        url: ``,
        method: "GET",
        params: query
      }),
      providesTags: ['Expense'],
      onQueryStarted: async (queryArgs, { dispatch, queryFulfilled }) => {
        // Store this as the active query
        dispatch(setActiveQuery({
          endpointName: 'getExpensesByUser',
          queryArgs
        }));

        try {
          await queryFulfilled;
        } catch (error) {
          // Optional: Clear the active query on error if desired
          dispatch(clearActiveQuery({ endpointName: 'getExpensesByUser' }));
        }
      },

    }),
    createExpense: build.mutation<Expense, CreateExpense>({
      query: (data) => ({
        url: "",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['Expense'],

    }),
    mergeExpenses: build.mutation<Expense, CreateExpense>({
      query: (data) => ({
        url: "/merge",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['Expense'],

    }),
    updateExpense: build.mutation<Expense, Expense>({
      query: (data) => ({
        url: "",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ['Expense'],
      onQueryStarted: async (updatedExpense, { dispatch, queryFulfilled, getState }) => {
        try {
          // Wait for the API call to complete first
          const { data: serverUpdatedExpenses } = await queryFulfilled;
          const serverUpdatedExpense = serverUpdatedExpenses?.[0]

          // Now update the cache with the server response
          const state = getState();
          const queries = state.activeQueries['getExpensesByUser'];

          if (queries) {
            const patchResult = dispatch(
              expensesApi.util.updateQueryData(
                'getExpensesByUser',
                queries,
                (draft) => {
                  const index = draft.findIndex(exp => {
                    return exp.expense_id == serverUpdatedExpense.expense_id
                  });
                  if (index !== -1) {
                    draft[index] = serverUpdatedExpense;
                  }
                }
              )
            );
            if (!patchResult) {
              console.log('❌ updateQueryData returned undefined - no cache entry found');
            }
          }
        } catch (error) {
          // API call failed - no update to cache
          console.error('Failed to update expense:', error);
        }
      },

    }),
    createExpenses: build.mutation<Expense[], CreateExpense[]>({
      query: (data) => ({
        url: "collection",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['Expense'],

    }),
    splitExpense: build.mutation<{ newExpenses: Expense[], splitExpense: Expense }, { newExpenses: CreateExpense[], expenseToSplit: Expense }>({
      query: (data) => ({
        url: "split",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['Expense'],

    }),
    deleteExpense: build.mutation<Boolean, Expense>({
      query: (data) => ({
        url: `${data.expense_id}`,
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ['Expense'],

    }),
    getExpense: build.query<Boolean, Expense>({
      query: (data) => ({
        url: `${data.expense_id}`,
        method: "GET",
      })


    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetExpenseQuery,
  useLazyGetExpenseQuery,
  useLazyGetExpensesByUserQuery,
  useCreateExpenseMutation,
  useDeleteExpenseMutation,
  useGetExpensesByUserQuery,
  useCreateExpensesMutation,
  useUpdateExpenseMutation,
  useSplitExpenseMutation,
  useMergeExpensesMutation 
} = expensesApi;



export const useExpenseUpdater = () => {
  const [updateExpenseApi] = useUpdateExpenseMutation();
  const dispatch = useDispatch();

  const updateExpense = async ({ updatedExpense, query, user }) => {
    // Update cache
    dispatch(
      expensesApi.util.updateQueryData(
        'getExpensesByUser',
        { ...query, user_id: user?.user_id },
        (draft) => {
          const index = draft.findIndex(exp => exp.id === updatedExpense.id);
          if (index !== -1) {
            Object.assign(draft[index], updatedExpense);
          }
        }
      )
    );

    // API call
    return updateExpenseApi(updatedExpense);
  };

  return updateExpense;
};