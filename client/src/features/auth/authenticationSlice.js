import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import apiClient from "../../utils/apiClient";
import { useContext } from "react";
import { SocketContext } from "../../context/SocketProvider";
import socketService from "../websockets/socketService";

// need to see why this is not being registered globally after some time

const normalizeUser = (user) => {
  // Ensure the object has a consistent id field and includes any other necessary fields.
  const normalized = {
    id: user._id ? user._id.toString() : user.id,
    username: user.username,
    email: user.email,
    accountBalance: user.accountBalance,
    bankBalance: user.bankBalance,
    avatar: user.avatar,
    lastLogin: user.lastLogin,
    activeGames: user.activeGames || [],
    // Add other fields as needed.
  };
  return normalized;
};

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
      const normalizedUser = normalizeUser(response.data);
      return { token, user: normalizedUser };
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

export const logoutUser = () => async (dispatch, getState) => {
  const state = getState();
  const user = state.auth.user;

  console.log("logoutUser: Initiating logout for user:", user);

  if (user && user.activeGames && user.activeGames.length > 0) {
    console.log("logoutUser: User is in active games:", user.activeGames);

    // Get the socket instance from your socket service
    const socket = socketService.getSocket();
    if (socket) {
      for (const gameId of user.activeGames) {
        console.log(
          `logoutUser: Emitting leaveGame for game ${gameId} for user ${user._id || user.id}`
        );
        socket.emit("leaveGame", { gameId, userId: user._id || user.id });
      }
    } else {
      console.warn("logoutUser: No socket found during logoutUser");
    }
  } else {
    console.log("logoutUser: No active games found for this user.");
  }

  console.log("logoutUser: Removing authToken from localStorage.");
  localStorage.removeItem("authToken");
  console.log("logoutUser: Dispatching logout action.");
  dispatch(logout());
  console.log("logoutUser: Logout complete.");
};
const token = localStorage.getItem("authToken");
const initialState = {
  user: null,
  token: token || null,
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
