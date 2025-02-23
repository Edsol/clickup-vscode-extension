import * as React from "react";
import * as ReactDOM from "react-dom/client"; // Importa il nuovo API di React 18
import TaskData from "./taskData";

import { ConfigProvider, Divider, theme } from "antd";
import {
  Skeleton,
  Button,
  Col,
  Row,
  Typography,
  Flex,
  Badge,
  Tooltip,
  Splitter,
  Layout
} from "antd";
const { Header, Footer, Sider, Content } = Layout;
import CommentIcon from "@resources/official_icons/dark/comment.svg";

import it_IT from "antd/locale/it_IT";

import "./index.css";

const vscode = (window as any).acquireVsCodeApi();
vscode.postMessage({ command: "init", text: "init react app!" });
// Trasforma build in un componente React
const RootComponent: React.FC = () => {
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);
  const [showComments, setShowComments] = React.useState<boolean>(true);
  const [comments, setComments] = React.useState<Array<Comment>>({});

  const sidebarIconWidth = 24;
  const sidebarIconHeight = 24;

  const selectedItemBgColor = isDarkTheme ? "bg-zinc-500" : "bg-zinc-200";
  const contentStyle: React.CSSProperties = {
    color: "#fff"
  };

  const siderStyle: React.CSSProperties = {
    textAlign: "center",
    color: isDarkTheme ? "#FFF" : "#000",
    backgroundColor: "var(--vscode-editor-background)",
    width: "25px",
    padding: 2
  };

  const layoutStyle = {
    borderRadius: 8,
    overflow: "hidden",
    width: "calc(100% - 8px)",
    maxWidth: "calc(100% - 8px)",
    height: "calc(100% - 8px)",
    minHeight: "calc(100% - 8px)"
  };

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
      <Layout className={"h-svh"} style={{ marginLeft: -20 }}>
        <Sider width="70px" style={siderStyle}>
          <div
            className={
              "cursor-pointer p-1 " +
              (showComments ? selectedItemBgColor + " rounded" : "")
            }
            onClick={() => {
              setShowComments(!showComments);
            }}
          >
            <Tooltip title="Show Comments">
              <div className="mt-3">
                <Badge count={comments.length} size="small" color={"#AAA"}>
                  <CommentIcon
                    width={sidebarIconWidth}
                    height={sidebarIconHeight}
                  />
                </Badge>
                <Typography.Title style={{ margin: 0, fontSize: "10px" }}>
                  Comments
                </Typography.Title>
              </div>
            </Tooltip>
          </div>
        </Sider>
        <Layout>
          <Content style={contentStyle}>
            <TaskData
              isDarkTheme={isDarkTheme}
              setDarkTheme={setIsDarkTheme}
              vscode={vscode}
              showComments={showComments}
              setShowComments={setShowComments}
              comments={comments}
              setComments={setComments}
            />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

const rootElement = document.getElementById("app");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<RootComponent />);
}
