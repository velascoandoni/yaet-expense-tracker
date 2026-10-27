// features/activeQueries/activeQueriesSlice.js
import { createSlice } from '@reduxjs/toolkit';

const activeQueriesSlice = createSlice({
  name: 'activeQueries',
  initialState: {},
  reducers: {
    setActiveQuery: (state, action) => {
      const { endpointName, queryArgs } = action.payload;
      state[endpointName] = queryArgs;
    },
    clearActiveQuery: (state, action) => {
      const { endpointName } = action.payload;
      delete state[endpointName];
    },
  },
});

export const { setActiveQuery, clearActiveQuery } = activeQueriesSlice.actions;
export const {reducer:activeQueriesReducer}=activeQueriesSlice ;