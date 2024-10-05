import * as React from "react";
import * as ReactDOM from "react-dom/client"; // Importa il nuovo API di React 18

const App = () => {
  const [message, setMessage] = React.useState("LIVE RELOAD");

  return (
    <div>
      <h1>{message}</h1>
      <button onClick={() => setMessage("You clicked the button!")}>
        Click Me
      </button>
    </div>
  );
};

// Ottieni l'elemento del DOM in cui montare l'app
const rootElement = document.getElementById("app");

// Usa createRoot per montare l'applicazione
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
