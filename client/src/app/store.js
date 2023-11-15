import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import authReducer from "../features/auth/authSlice";
import eventsReducer from "../features/event/eventsSlice";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import volunteersReducer from "../features/volun/volunteersSlice";



export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    events: eventsReducer,
    volunteers: volunteersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),

  devTools: process.env.NODE_ENV === "production" ? false : true,
});

setupListeners(store.dispatch);
