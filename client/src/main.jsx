import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./App.jsx";
import "./index.css";
import About from "./components/generalUI/About.jsx";
import Layout from "./Layout.jsx";
import Games from "./components/generalUI/Games.jsx";
import RegistrationForm from "./components/authentication/RegistrationForm.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/about" element={<About />} />
          <Route path="/games" element={<Games />} />
          <Route path="/register" element={<RegistrationForm />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  </StrictMode>
);
