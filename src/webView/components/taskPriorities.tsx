import * as React from "react";
import { Input, Select, Typography } from "antd";
const { Text } = Typography;

export default function TaskPriorities({ priorities, value, setValue }) {
  let parsedPriorities = [];

  if (priorities) {
    parsedPriorities = priorities.map((priority) => {
      return {
        value: priority.id,
        label: priority.priority
      };
    });
  }

  const handleChange = (value) => {
    console.log("priority handle", value);

    setValue((prevFields) => ({
      ...prevFields,
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
