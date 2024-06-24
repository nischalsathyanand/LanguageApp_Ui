import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import "semantic-ui-css/semantic.min.css";
import { LanguageProvider } from './components/LanguageContext';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <LanguageProvider>
    <App />
    </LanguageProvider>
  // </React.StrictMode>
);