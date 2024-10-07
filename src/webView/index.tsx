import * as React from "react";
import * as ReactDOM from "react-dom/client"; // Importa il nuovo API di React 18
import App from "./App";

// Ottieni l'elemento del DOM in cui montare l'app
const rootElement = document.getElementById("app");

// Usa createRoot per montare l'applicazione
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
