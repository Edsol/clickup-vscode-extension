import * as React from "react";
import { Select, Typography } from "antd";
const { Text } = Typography;

export default function TaskAssignees({ members, value, setValue }) {
  const parsedMembers = members.map((member) => {
    return {
      value: member.id,
      label: member.username
    };
  });
  const parsedSelectedMembers = value.map((member) => {
    return member.id;
  });

  const handleChange = (value) => {
    setValue(() => ({
      priority: Number.parseInt(value)
    }));
  };

  return (
    <div>
      <Text strong>Assignees</Text>
      <Select
        mode="multiple"
        allowClear
        options={parsedMembers}
        style={{ width: "100%" }}
        defaultValue={parsedSelectedMembers}
        onChange={handleChange}
      />
    </div>
  );
}
