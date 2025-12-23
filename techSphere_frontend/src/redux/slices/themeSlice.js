import { createSlice } from "@reduxjs/toolkit";

// Get theme from localStorage or default to 'light'
const savedTheme = localStorage.getItem("theme") || "light";

// Apply theme to document on initial load
if (savedTheme === "dark") {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

const initialState = {
  mode: savedTheme,
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";

      // Update localStorage
      localStorage.setItem("theme", state.mode);

      // Update document class
      if (state.mode === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },
    setTheme: (state, action) => {
      state.mode = action.payload;

      // Update localStorage
      localStorage.setItem("theme", state.mode);

      // Update document class
      if (state.mode === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
