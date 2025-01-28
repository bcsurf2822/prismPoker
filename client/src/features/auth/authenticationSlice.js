import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import apiClient from "../../utils/apiClient";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/register", userData);
      return response.data;
    } catch (e) {
      if (e.response && e.response.data) {
        return rejectWithValue(e.response.data);
      }
      return rejectWithValue(e.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/login", credentials);
      return response.data;
    } catch (e) {
      if (e.response && e.response.data) {
        return rejectWithValue(e.response.data);
      }
      return rejectWithValue(e.message);
    }
  }
);

export const rehydrateUser = createAsyncThunk(
  "auth/rehydrateUser",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return rejectWithValue("No token found");
      }

      const response = await apiClient.get("/user/user-info", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return { token, user: response.data };
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const addFunds = createAsyncThunk(
  "auth/addFunds",
  async ({ amount }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await apiClient.post(
        "/user/add-funds",
        { amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (e) {
      if (e.response && e.response.data) {
        return rejectWithValue(e.response.data);
      }
      return rejectWithValue(e.message);
    }
  }
);

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("authToken", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(rehydrateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(rehydrateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(rehydrateUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
      })
      .addCase(addFunds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFunds.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(addFunds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
