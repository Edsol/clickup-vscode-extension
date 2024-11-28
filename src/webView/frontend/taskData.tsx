import * as React from "react";
import { Task, Status, Priority, Tag, Assignee, Comment } from "../../types";

import { Skeleton, Button, Col, Divider, Row, Typography } from "antd";
const { Text } = Typography;

import { blue, lime } from "@ant-design/colors";

import TaskId from "./components/taskId";
import TaskName from "./components/taskName";
import TaskStatus from "./components/taskStatus";
import TaskAssignees from "./components/taskAssignees";
import TaskDescription from "./components/taskDescription";
import TaskTags from "./components/taskTags";
import TaskPriorities from "./components/taskPriorities";

import Comments from "./comments";

const app = ({ isDarkTheme, setDarkTheme, vscode }) => {
  const [isReady, setIsReady] = React.useState<boolean>(false);

  const [task, setTask] = React.useState<Task>({});
  const [modifiedFields, setModifiedFields] = React.useState<Task>({});
  const [statuses, setStatuses] = React.useState<Array<Status>>({});
  const [priorities, setPriorities] = React.useState<Array<Priority>>({});
  const [members, setMembers] = React.useState<Array<Assignee>>({});
  const [tags, setTags] = React.useState<Array<Tag>>({});

  const [comments, setComments] = React.useState<Array<Comment>>({});

  const hasModifiedFields = () => {
    return Object.keys(modifiedFields).length === 0 ? false : true;
  };
  const notifyMessage = (text: string, type: string = "success") => {
    vscode.postMessage({ command: "notification", text: text, type: type });
  };

  React.useEffect(() => {
    vscode.postMessage({ command: "ready", text: "React App is ready!" });

    const handleMessage = async (event: MessageEvent) => {
      const { command, data } = event.data;

      if (command === "task") {
        setTask(data.task);
        setStatuses(data.statuses);
        setPriorities(data.priorities);
        setMembers(data.members);
        setTags(data.tags);
        setComments(data.comments);

        // hide skeleton
        setIsReady(true);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  if (!isReady) {
    return <Skeleton />;
  }

  function submit() {
    vscode.postMessage({
      command: "save",
      data: {
        task: modifiedFields
      }
    });
  }

  const labelStyle: React.CSSProperties = {
    color: isDarkTheme ? "#FFF" : "#000"
  };

  const marginTop = "20px";
  return (
    <div>
      <Divider orientation="left">
        <TaskId task={task} notifyMessage={notifyMessage} />
      </Divider>
      <Text strong style={labelStyle}>
        Name
      </Text>
      <TaskName task={task} setValue={setModifiedFields} />
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={12} lg={12}>
          <div style={{ marginTop: marginTop }}>
            <Text strong style={labelStyle}>
              Status
            </Text>
            <TaskStatus
              statuses={statuses}
              value={task.status ? task.status.status : {}}
              setValue={setModifiedFields}
            />
          </div>

          <div style={{ marginTop: marginTop }}>
            <Text strong style={labelStyle}>
              Priority
            </Text>
            <TaskPriorities
              priorities={priorities}
              value={task.priority}
              setValue={setModifiedFields}
            />
          </div>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <div style={{ marginTop: marginTop }}>
            <Text strong style={labelStyle}>
              Assignees
            </Text>
            <TaskAssignees
              members={members}
              value={task.assignees}
              setValue={setModifiedFields}
            />
          </div>
          <div style={{ marginTop: marginTop }}>
            <Text strong style={labelStyle}>
              Tags
            </Text>
            <TaskTags
              tags={tags}
              value={task.tags}
              setValue={setModifiedFields}
            />
          </div>
        </Col>
      </Row>
      <div style={{ marginTop: marginTop }}>
        <Text strong style={labelStyle}>
          Description
        </Text>
        <TaskDescription
          value={task.description}
          setValue={setModifiedFields}
        />
      </div>

      <Button
        color="primary"
        variant="filled"
        onClick={submit}
        style={{
          marginTop: "10px",
          position: "absolute",
          right: "20px",
          backgroundColor: lime[6],
          color: "white"
        }}
        disabled={!hasModifiedFields()}
      >
        Save
      </Button>
      <Divider />
      <Comments comments={comments} />
    </div>
  );
};

export default app;
