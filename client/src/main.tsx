import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { UserProvider } from "./lib/user-context";

createRoot(document.getElementById("root")!).render(
  <UserProvider>
    <App />
  </UserProvider>
);
