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
      return rejectWithValue(error.response.data || error.message);
    }
  }
);

const gamesSlice = createSlice({
  name: "games",
  initialState: {
    games: [],
    loading: false,
    error: null,
  },
  reducers: {
    updateGame: (state, action) => {
      const updatedGame = action.payload;
      const index = state.games.findIndex((game) => game.id === updatedGame.id);
      if (index !== -1) {
        state.games[index] = updatedGame;
      } else {
        state.games.push(updatedGame);
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
      });
  },
});

export const { updateGame } = gamesSlice.actions;
export default gamesSlice.reducer;
