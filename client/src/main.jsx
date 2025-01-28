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

createRoot(document.getElementById("root")).render(
  <StrictMode>
 <Provider store={store}>
 <BrowserRouter>
        <Routes>
          {/* General Layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<App />} />
            <Route path="about" element={<About />} />
            <Route path="games" element={<Games />} />
            <Route path="register" element={<RegistrationForm />} />
            <Route path="profile" element={<Profile />} />
            <Route path="account" element={<Account />} />
          </Route>

          {/* Room Layout */}
          <Route path="/room/:roomId" element={<RoomLayout />}>
            <Route index element={<Room />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
