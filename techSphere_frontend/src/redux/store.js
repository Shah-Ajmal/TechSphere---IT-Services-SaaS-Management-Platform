import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import themeReducer from "./slices/themeSlice";
import ticketReducer from "./slices/ticketSlice"; // Import it here
export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    tickets: ticketReducer,
  },
});
export default store;
