import * as React from "react";
import * as ReactDOM from "react-dom/client"; // Importa il nuovo API di React 18
import App from "./App";

import { ConfigProvider, theme } from "antd";
import itIT from "antd/locale/it_IT";

// import "./app.css";

const vscode = (window as any).acquireVsCodeApi();
vscode.postMessage({ type: "init", text: "init react app!" });
// Trasforma build in un componente React
const RootComponent: React.FC = () => {
  const [isDarkTheme, setIsDarkTheme] = React.useState(false); // Usa useState all'interno di un componente React

  window.addEventListener("message", (event) => {
    const { command, data } = event.data;
    if (command === "theme") {
      setIsDarkTheme(data.isDark);
    }
  });

  return (
    <ConfigProvider
      locale={itIT}
      theme={{
        // algorithm: isDarkTheme ? theme.darkAlgorithm : theme.defaultAlgorithm,
        algorithm: theme.defaultAlgorithm,
        cssVar: true
      }}
    >
      <App setDarkTheme={setIsDarkTheme} vscode={vscode} />
    </ConfigProvider>
  );
};

const rootElement = document.getElementById("app");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<RootComponent />);
}
