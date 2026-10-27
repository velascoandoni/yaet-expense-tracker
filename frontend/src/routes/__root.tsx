
import { createRootRoute, Outlet, useLoaderData } from '@tanstack/react-router';
import { Provider } from 'react-redux';
import '../App.css';
import '../css/CONSTS/colors.css'
import '../css/layout/layout.css';
import '../css/Inputs.css';
import '../css/Tables.css'
import '../css/Forms.css'

import { configureStore } from '@reduxjs/toolkit';
import VerticalMenu from '../my_components/Layout/VerticalMenu';
import { expensesApi } from '../redux/api/expensesApi';
import { expenseTypesApi } from '../redux/api/expenseTypesApi';
import { userApi } from '../redux/api/usersApi';
import { activeQueriesReducer } from '../redux/slices/ActiveQuerySlice';

export const store = configureStore({
  reducer: {
    activeQueries: activeQueriesReducer,
    [userApi.reducerPath]: userApi.reducer,
    [expensesApi.reducerPath]: expensesApi.reducer,
    [expenseTypesApi.reducerPath]: expenseTypesApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userApi.middleware)
      .concat(expensesApi.middleware)
      .concat(expenseTypesApi.middleware),
});


export const Route = createRootRoute({
  component: App,
  loader: () => {

    return JSON.parse(localStorage.getItem("user"))
  }
})


function App() {
  const user = useLoaderData({ from: '__root__' });

  window.addEventListener('storage', (event) => {

  });

  return (
    <Provider store={store}>

      <div className='app'>

        <VerticalMenu user={user}/>


        <div className='content'>
          
            <Outlet />
        </div>
      </div>

    </Provider>
  );

}