// src/main.jsx

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// Import your base styles
import "./index.css"; 

import "./global.css"; 

const container = document.getElementById("root");

if (!container) {
  console.error('No #root element found. Check index.html for <div id="root"></div>');
} else {
  createRoot(container).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}