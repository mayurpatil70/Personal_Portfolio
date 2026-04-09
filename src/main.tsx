import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import Modal from "react-modal";
import { initializeTracker } from "./lib/tracker";

// Set the app element for react-modal
Modal.setAppElement("#root");

// Initialize analytics tracker
const tracker = initializeTracker(
  import.meta.env.VITE_WORKER_URL || "http://127.0.0.1:8787",
);
tracker
  .init()
  .catch((err) => console.warn("Failed to initialize tracker:", err));

// Force scroll to top (home) on every page load / refresh
// We run this after a brief delay so DOM layout settles
document.addEventListener("DOMContentLoaded", () => {
  // Disable browser scroll position restore (if possible)
  window.history.scrollRestoration = "manual";

  // Delay scroll so layout finishes
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 100);
});

// Render the app
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
