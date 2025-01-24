import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authenticationSlice";

const rootReducer = combineReducers({
  auth: authReducer,
});

export default rootReducer;
