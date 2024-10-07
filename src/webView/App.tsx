import * as React from "react";
import { Task, Status, Priority, Tag, Assignee } from "../types";

import { Flex, Skeleton, Button } from "antd";

import TaskButton from "./components/taskButton";
import TaskName from "./components/taskName";
import TaskStatus from "./components/taskStatus";
import TaskAssignees from "./components/taskAssignees";
import TaskDescription from "./components/taskDescription";
import TaskTags from "./components/taskTags";
import TaskPriorities from "./components/taskPriorities";

const app = ({ setDarkTheme, vscode }) => {
  const [isReady, setIsReady] = React.useState<boolean>(false);
  const [disableSubmit, setDisabledSubmit] = React.useState<boolean>(true);

  const [task, setTask] = React.useState<Task>({});
  const [statuses, setStatuses] = React.useState<Array<Status>>({});
  const [priorities, setPriorities] = React.useState<Array<Priority>>({});
  const [members, setMembers] = React.useState<Array<Assignee>>({});
  const [tags, setTags] = React.useState<Array<Tag>>({});

  React.useEffect(() => {
    vscode.postMessage({ type: "ready", text: "React App is ready!" });

    const handleMessage = async (event: MessageEvent) => {
      const { type, data } = event.data;

      if (type === "init") {
        console.log("init message", data);

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

  return (
    <Flex gap="middle" vertical className="bg-white">
      <TaskButton task={task} />
      <TaskName task={task} />
      <TaskStatus statuses={statuses} value={task.status.id} />
      <TaskPriorities priorities={priorities} value={task.priority} />
      <TaskAssignees members={members} value={task.assignees} />
      <TaskTags tags={tags} value={task.tags} />
      <TaskDescription description={task.description} />

      <Button type="primary" disabled={disableSubmit}>
        Save
      </Button>
    </Flex>
  );
};

export default app;
