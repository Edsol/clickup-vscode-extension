import * as React from "react";
import { Task } from "../../types";
import { Input, Typography } from "antd";
const { Text } = Typography;

export default function TaskName({ task }) {
  return (
    <div>
      <Text strong>Task name</Text>
      <Input defaultValue={task.name} label="name" placeholder="task title" />
    </div>
  );
}
