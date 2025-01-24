import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authenticationSlice";
import gamesReducer from "../features/games/gamesSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  games: gamesReducer,
});

export default rootReducer;
