import * as React from "react";
import { Task, Status, Priority, Tag, Assignee } from "../types";

import { Flex, Skeleton, Button } from "antd";

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
    vscode.postMessage({ type: "ready", text: "React App is ready!" });

    const handleMessage = async (event: MessageEvent) => {
      const { type, data } = event.data;

      if (type === "task") {
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
    console.log("SUBMIT DATA", modifiedFields);
    vscode.postMessage({
      type: "save",
      data: {
        task: modifiedFields
      }
    });
  }

  return (
    <Flex gap="middle" vertical className="bg-white">
      <TaskId task={task} />
      <TaskName task={task} setValue={setModifiedFields} />
      <TaskStatus
        statuses={statuses}
        value={task.status.status}
        setValue={setModifiedFields}
      />
      <TaskPriorities
        priorities={priorities}
        value={task.priority}
        setValue={setModifiedFields}
      />
      <TaskAssignees
        members={members}
        value={task.assignees}
        setValue={setModifiedFields}
      />
      <TaskTags tags={tags} value={task.tags} setValue={setModifiedFields} />
      <TaskDescription value={task.description} setValue={setModifiedFields} />

      <Button color="default" variant="filled" onClick={submit}>
        Save
      </Button>
    </Flex>
  );
};

export default app;
