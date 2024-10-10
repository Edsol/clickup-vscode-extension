import * as React from "react";
import { Task } from "../../types";
import { Input, Typography, Form } from "antd";
const { Text } = Typography;

export default function TaskName({ task, setValue }) {
  const handleChange = (value) => {
    setValue(() => ({
      name: value.currentTarget.value
    }));
  };

  return (
    <div>
      <Text strong>Task name</Text>
      <Input
        defaultValue={task.name}
        label="name"
        placeholder="task title"
        onChange={handleChange}
      />
    </div>
  );
}
