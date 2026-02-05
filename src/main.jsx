import React from "react";
import ReactDOM from "react-dom/client";
import "./style.css";
import App from "./App"; // ← Import App, not LandingPage

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App /> {/* ← Render App */}
  </React.StrictMode>
);
