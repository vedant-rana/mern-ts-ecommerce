import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles/app.scss";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";

// theme
import "primereact/resources/themes/lara-light-indigo/theme.css";
// css
import "primereact/resources/primereact.min.css";
// icons
import "primeicons/primeicons.css";
// layout (optional)
import "primeflex/primeflex.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
