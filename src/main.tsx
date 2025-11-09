import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Force dark mode
const root = document.documentElement;
root.classList.add("dark");

createRoot(document.getElementById("root")!).render(<App />);
