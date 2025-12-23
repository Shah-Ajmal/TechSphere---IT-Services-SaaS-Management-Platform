import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as ticketService from "@/services/ticketService";

// Feature 7: Async thunk for fetching tickets
export const fetchAllTickets = createAsyncThunk(
  "tickets/fetchAll",
  async (filters, { rejectWithValue }) => {
    try {
      const response = await ticketService.getAllTickets(filters);
      return response.data; // Expecting { success: true, data: { tickets: [...] } }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch tickets"
      );
    }
  }
);

const ticketSlice = createSlice({
  name: "tickets",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTickets.fulfilled, (state, action) => {
        state.loading = false;
        // Map to your backend response structure
        state.items = action.payload.tickets || [];
      })
      .addCase(fetchAllTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default ticketSlice.reducer;
