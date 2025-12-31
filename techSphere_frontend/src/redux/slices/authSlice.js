import { createSlice } from "@reduxjs/toolkit";

// Get initial state from localStorage
const token = localStorage.getItem("token");
const user = localStorage.getItem("user");

const initialState = {
  user: user ? JSON.parse(user) : null,
  token: token || null,
  isAuthenticated: !!token,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;

      // Save to localStorage
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;

      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    clearError: (state) => {
      state.error = null;
    },
    // NEW: Update user data (for profile updates)
    setUser: (state, action) => {
      state.user = action.payload;
      // Also update localStorage
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  setUser, // Export the new action
} = authSlice.actions;

export default authSlice.reducer;
