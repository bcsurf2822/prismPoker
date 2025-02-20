import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import websocketMiddleware from "../features/websockets/websocketMiddleware";



export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(websocketMiddleware),
});
