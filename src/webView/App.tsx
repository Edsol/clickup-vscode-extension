import * as React from "react";
import { Task, Status, Priority, Tag, Assignee } from "../types";
import { Input, Typography, Select, Skeleton } from "antd";
const { TextArea } = Input;
const { Text, Link } = Typography;
import { TaskButton } from "./components/taskButton";

const vscode = (window as any).acquireVsCodeApi(); // Ottieni l'API di VS Code
const app = () => {
  const [isReady, setIsReady] = React.useState<boolean>(false);

  const [task, setTask] = React.useState<Task>({});

  const [statuses, setStatuses] = React.useState<Array<Status>>({});
  const [statusValue, setStatusValue] = React.useState();

  const [priorities, setPriorities] = React.useState<Array<Priority>>({});

  const [members, setMembers] = React.useState<Array<Assignee>>({});
  const [assignesValue, setAssignesValue] = React.useState<Array<Assignee>>();

  const [tags, setTags] = React.useState<Array<Tag>>({});

  React.useEffect(() => {
    vscode.postMessage({ type: "ready", text: "React App is ready!" });

    const handleMessage = async (event: MessageEvent) => {
      const { type, text, data } = event.data;

      if (type === "init") {
        console.log("init message", data);
        const taskData = data.task;

        setTask(taskData);
        setPriorities(data.priorities);
        setTags(data.tags);

        const statusesOptions: Array<any> = [];
        for (const status of data.statuses) {
          statusesOptions.push({
            value: status.id,
            label: status.status
          });
        }
        setStatuses(statusesOptions);
        setStatusValue(taskData.status.id);

        const membersOptions: Array<any> = [];
        for (const member of data.members) {
          membersOptions.push({
            value: member.id,
            label: member.username
          });
        }
        setMembers(membersOptions);

        const assigneelist: Array<number> = [];
        for (const assignee of taskData.assignees) {
          assigneelist.push(assignee.id);
        }
        setAssignesValue(assigneelist);

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
    <div>
      <TaskButton task={task} />
      <div>
        <Text strong>Task name</Text>
        <Input value={task.name} label="name" placeholder="task title" />
      </div>
      <div>
        <Text strong>Status</Text>
        <Select options={statuses} style={{ width: 200 }} value={statusValue} />
      </div>
      <div>
        <Text strong>Assignes</Text>
        <Select
          mode="multiple"
          allowClear
          options={members}
          style={{ width: 200 }}
          value={assignesValue}
        />
      </div>
      <div>
        <Text strong>Comment</Text>
        <TextArea
          rows={4}
          placeholder="Add a comment"
          value={task.description}
        />
      </div>
    </div>
  );
};

export default app;
