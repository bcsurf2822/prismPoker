import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../utils/apiClient";

export const fetchGames = createAsyncThunk(
  "games/fetchGames",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/games");

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || error.message);
    }
  }
);

export const fetchGameById = createAsyncThunk(
  "games/fetchGameById",
  async (gameId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/games/${gameId}`);
      return response.data;
    } catch (error) {
      console.error("Fetch Game Error:", error);
      return rejectWithValue(error.response?.data || "Game not found");
    }
  }
);

const gamesSlice = createSlice({
  name: "games",
  initialState: {
    games: [],
    currentGame: null,
    loading: false,
    error: null,
  },
  reducers: {
    updateGame: (state, action) => {
      console.log("Updating game with payload:", action.payload);
      const updatedGame = action.payload;
      const gameId = updatedGame._id?.toString();
      const index = state.games.findIndex(
        (g) => g._id?.toString() === gameId // Optional chaining
      );
      if (index !== -1) {
        state.games[index] = updatedGame;
      } else {
        state.games.push(updatedGame);
      }

      // Update currentGame
      if (state.currentGame?._id?.toString() === gameId) {
        state.currentGame = updatedGame;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.loading = false;
        state.games = action.payload;
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchGameById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGameById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentGame = action.payload;
      })
      .addCase(fetchGameById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateGame } = gamesSlice.actions;
export default gamesSlice.reducer;
