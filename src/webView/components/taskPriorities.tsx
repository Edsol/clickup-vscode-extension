import * as React from "react";
import { Input, Select, Typography } from "antd";
const { Text } = Typography;

export default function TaskPriorities({ priorities, value, setValue }) {
  const parsedPriorities = priorities.map((priority) => {
    return {
      value: priority.id,
      label: priority.priority
    };
  });

  const handleChange = (value) => {
    setValue(() => ({
      priority: Number.parseInt(value)
    }));
  };

  return (
    <div>
      <Text strong>Priority</Text>
      <Select
        options={parsedPriorities}
        style={{ width: "100%" }}
        defaultValue={value ? value.id : null}
        onChange={handleChange}
        allowClear
      />
    </div>
  );
}
