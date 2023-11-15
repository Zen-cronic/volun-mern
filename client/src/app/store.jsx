import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import authReducer from "../features/auth/authSlice";
import eventsReducer from "../features/event/eventsSlice";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import volunteersReducer from "../features/volun/volunteersSlice";

import { isRejectedWithValue } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const rtkQueryErrorLogger = (api) => (next) => (action) => {
  // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
//   if (action.type.endsWith("/rejected")) {

if(isRejectedWithValue('putUpdateEventInfo/rejected')){
    console.warn("We got a rejected action!  ", action.error);
    // toast.error({ title: 'Async error!', message: action.error.data.message })
    toast.error(action.error.data.message);
  }

  return next(action);
};

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    events: eventsReducer,
    volunteers: volunteersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(rtkQueryErrorLogger, apiSlice.middleware),

  //    false in prod
  devTools: true,
});

setupListeners(store.dispatch);
