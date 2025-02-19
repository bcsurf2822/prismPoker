import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./App.jsx";
import "./index.css";
import About from "./components/generalUI/About.jsx";
import Layout from "./layouts/Layout.jsx";
import Games from "./components/generalUI/Games.jsx";
import RegistrationForm from "./components/authentication/RegistrationForm.jsx";
import Room from "./components/tableUI/Room.jsx";

import { Provider } from "react-redux";
import { store } from "./app/store.js";
import RoomLayout from "./layouts/RoomLayout.jsx";
import Profile from "./components/generalUI/Profile.jsx";
import Account from "./components/generalUI/Account.jsx";
import Home from "./components/generalUI/Home.jsx";
import SocketProvider from "./context/SocketProvider.jsx";
import { Toaster } from "react-hot-toast";
import AppInitializer from "./context/AppInitializer.jsx";
import { OpenWindowsProvider } from "./context/WindowContext.jsx";
import TestRoom from "./components/tableUI/TestRoom.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <SocketProvider>
        <OpenWindowsProvider>
          <Toaster />
          <AppInitializer>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<App />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="about" element={<About />} />
                  <Route path="games" element={<Games />} />
                  <Route path="register" element={<RegistrationForm />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="account" element={<Account />} />
                </Route>
                <Route path="/room/:roomId" element={<RoomLayout />}>
                
                  <Route index element={<Room />} />
                </Route>
                <Route path="/room/testRoom" element={<RoomLayout />}>
                
                <Route index element={<TestRoom />} />
              </Route>
              </Routes>
            </BrowserRouter>
          </AppInitializer>
        </OpenWindowsProvider>
      </SocketProvider>
    </Provider>
  </StrictMode>
);
