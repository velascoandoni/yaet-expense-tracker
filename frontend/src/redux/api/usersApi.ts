import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseURL } from "../../CONSTS";

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${baseURL}/users/` }),
  tagTypes: ['User'], // Optional: for cache invalidation
  endpoints: (build) => ({
    login: build.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: build.mutation<RegisterResponse, RegisterRequest>({
      query: (data) => ({
        url: "register",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

// Export hooks for usage in components
export const { useLoginMutation, useRegisterMutation } = userApi;

// Type definitions (you can define these in a separate types file)
interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  // add other registration fields as needed
}

interface RegisterResponse {
  message: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}