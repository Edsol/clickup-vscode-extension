import * as React from "react";
import { Task, Status, Priority, Tag, Assignee } from "../../types";

import { Flex, Skeleton, Button, Col, Divider, Row } from "antd";

import TaskId from "./components/taskId";
import TaskName from "./components/taskName";
import TaskStatus from "./components/taskStatus";
import TaskAssignees from "./components/taskAssignees";
import TaskDescription from "./components/taskDescription";
import TaskTags from "./components/taskTags";
import TaskPriorities from "./components/taskPriorities";

const app = ({ setDarkTheme, vscode }) => {
  const [isReady, setIsReady] = React.useState<boolean>(false);

  const [task, setTask] = React.useState<Task>({});
  const [modifiedFields, setModifiedFields] = React.useState<Task>({});
  const [statuses, setStatuses] = React.useState<Array<Status>>({});
  const [priorities, setPriorities] = React.useState<Array<Priority>>({});
  const [members, setMembers] = React.useState<Array<Assignee>>({});
  const [tags, setTags] = React.useState<Array<Tag>>({});

  React.useEffect(() => {
    vscode.postMessage({ command: "ready", text: "React App is ready!" });

    const handleMessage = async (event: MessageEvent) => {
      const { command, data } = event.data;

      if (command === "task") {
        console.log("task message", data);

        setTask(data.task);
        setStatuses(data.statuses);
        setPriorities(data.priorities);
        setMembers(data.members);
        setTags(data.tags);

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

  return (
    <div>
      <Divider></Divider>
      <TaskId task={task} />
      <Divider></Divider>
      <TaskName task={task} setValue={setModifiedFields} />
      <Divider></Divider>
      <Row align="middle">
        <Col xs={1} sm={6} md={6} lg={6} xl={6}>
          Status:
        </Col>
        <Col xs={1} sm={6} md={6} lg={6} xl={6}>
          <TaskStatus
            statuses={statuses}
            value={task.status ? task.status.status : {}}
            setValue={setModifiedFields}
          />
        </Col>
      </Row>
      <Row align="middle">
        <Col xs={1} sm={6} md={6} lg={6} xl={6}>
          Priority:
        </Col>
        <Col xs={1} sm={6} md={6} lg={6} xl={6}>
          <TaskPriorities
            priorities={priorities}
            value={task.priority}
            setValue={setModifiedFields}
          />
        </Col>
      </Row>
      <Row align="middle">
        <Col xs={1} sm={6} md={6} lg={6} xl={6}>
          Assignees:
        </Col>
        <Col xs={1} sm={6} md={6} lg={6} xl={6}>
          <TaskAssignees
            members={members}
            value={task.assignees}
            setValue={setModifiedFields}
          />
        </Col>
      </Row>
      <Row align="middle">
        <Col xs={1} sm={6} md={6} lg={6} xl={6}>
          Tags:
        </Col>
        <Col xs={1} sm={6} md={6} lg={6} xl={6}>
          <TaskTags
            tags={tags}
            value={task.tags}
            setValue={setModifiedFields}
          />
        </Col>
      </Row>
      <TaskDescription value={task.description} setValue={setModifiedFields} />
      <Button color="default" variant="filled" onClick={submit}>
        Save
      </Button>
    </div>
  );
};

export default app;
