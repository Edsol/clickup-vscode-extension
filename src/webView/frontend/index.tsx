import * as React from "react";
import * as ReactDOM from "react-dom/client"; // Importa il nuovo API di React 18
import TaskData from "./taskData";

import { ConfigProvider, Divider, theme } from "antd";
import it_IT from "antd/locale/it_IT";

import "./index.css";

const vscode = (window as any).acquireVsCodeApi();
vscode.postMessage({ command: "init", text: "init react app!" });
// Trasforma build in un componente React
const RootComponent: React.FC = () => {
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);

  window.addEventListener("message", (event) => {
    const { command, data } = event.data;
    if (command === "theme") {
      setIsDarkTheme(data.isDark);
    }
  });

  return (
    <ConfigProvider
      locale={it_IT}
      theme={{
        algorithm: isDarkTheme ? theme.darkAlgorithm : theme.defaultAlgorithm,
        cssVar: true
      }}
    >
      <TaskData
        isDarkTheme={isDarkTheme}
        setDarkTheme={setIsDarkTheme}
        vscode={vscode}
      />
      <Divider />
    </ConfigProvider>
  );
};

const rootElement = document.getElementById("app");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<RootComponent />);
}
