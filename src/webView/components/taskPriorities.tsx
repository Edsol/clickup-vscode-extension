import * as React from "react";
import { Input, Select, Typography } from "antd";
const { Text } = Typography;

export default function TaskPriorities({ priorities, value }) {
  const parsedPriorities = priorities.map((priority) => {
    return {
      value: priority.id,
      label: priority.priority
    };
  });

  return (
    <div>
      <Text strong>Priority</Text>
      <Select
        options={parsedPriorities}
        style={{ width: "100%" }}
        defaultValue={value}
      />
    </div>
  );
}
