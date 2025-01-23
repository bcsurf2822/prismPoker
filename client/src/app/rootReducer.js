import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/authenticationSlice";

const rootReducer = combineReducers({
  auth: authReducer,
});

export default rootReducer;
