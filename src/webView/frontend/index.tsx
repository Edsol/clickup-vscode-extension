import * as React from "react";
import * as ReactDOM from "react-dom/client"; // Importa il nuovo API di React 18
import TaskData from "./taskData";
import Comments from "./comments";
import Subtasks from "./subtasks";

import { ConfigProvider, theme } from "antd";
import { Typography, Badge, Tooltip, Layout } from "antd";
// eslint-disable-next-line @typescript-eslint/naming-convention
const { Header, Footer, Sider, Content } = Layout;
import CommentIcon from "@resources/official_icons/dark/comment.svg";
import SubtaskIcon from "@resources/official_icons/dark/subtask.svg";

import it_IT from "antd/locale/it_IT";

import "./index.css";

const vscode = (window as any).acquireVsCodeApi();
vscode.postMessage({ command: "init", text: "init react app!" });
// Trasforma build in un componente React
// eslint-disable-next-line @typescript-eslint/naming-convention
const RootComponent: React.FC = () => {
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);

  const [comments, setComments] = React.useState<Array<Comment>>({});
  const [subtasks, setSubtasks] = React.useState<Array<Comment>>({});

  type ActiveViewType = "comments" | "subtasks" | "taskdata";

  const [activeView, setActiveView] =
    React.useState<ActiveViewType>("taskdata");

  const toggleSidebarElement = (selected: ActiveViewType) => {
    setActiveView((prev) => (prev === selected ? "taskdata" : selected));
  };

  const openSubtask = (taskId) => {
    vscode.postMessage({
      command: "openTask",
      taskItem: taskId,
      data: {
        task: taskId
      }
    });
  };

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
              (activeView === "comments"
                ? selectedItemBgColor + " rounded"
                : "")
            }
            onClick={() => {
              toggleSidebarElement("comments");
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
          <div
            className={
              "cursor-pointer p-1 " +
              (activeView === "subtasks"
                ? selectedItemBgColor + " rounded"
                : "")
            }
            onClick={() => {
              toggleSidebarElement("subtasks");
            }}
          >
            <Tooltip title="Show Subtasks">
              <div className="mt-3">
                <Badge
                  count={subtasks ? subtasks.length : 0}
                  size="small"
                  color={"#AAA"}
                >
                  <SubtaskIcon
                    width={sidebarIconWidth}
                    height={sidebarIconHeight}
                  />
                </Badge>
                <Typography.Title style={{ margin: 0, fontSize: "10px" }}>
                  SubTasks
                </Typography.Title>
              </div>
            </Tooltip>
          </div>
        </Sider>
        <Layout>
          <Content style={contentStyle}>
            {activeView === "comments" && (
              <Comments
                comments={comments}
                setComments={setComments}
                sendComment={() => {}}
              />
            )}
            {activeView === "subtasks" && (
              <Subtasks
                subtasks={subtasks}
                setSubtasks={setSubtasks}
                openSubtask={(taskId) => openSubtask(taskId)}
              />
            )}
            {activeView === "taskdata" && (
              <TaskData
                isDarkTheme={isDarkTheme}
                vscode={vscode}
                setComments={setComments}
                setSubtasks={setSubtasks}
                openSubtask={(taskId) => openSubtask(taskId)}
              />
            )}
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
