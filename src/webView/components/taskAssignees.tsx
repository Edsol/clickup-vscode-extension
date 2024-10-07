import * as React from "react";
import { Select, Typography } from "antd";
const { Text } = Typography;

export default function TaskAssignees({ members, value }) {
  const parsedMembers = members.map((member) => {
    return {
      value: member.id,
      label: member.username
    };
  });
  const parsedSelectedMembers = value.map((member) => {
    return member.id;
  });
  return (
    <div>
      <Text strong>Assignees</Text>
      <Select
        mode="multiple"
        allowClear
        options={parsedMembers}
        style={{ width: "100%" }}
        defaultValue={parsedSelectedMembers}
      />
    </div>
  );
}
