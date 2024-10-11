import * as React from "react";
import { Select } from "antd";

export default function TaskAssignees({ members, value, setValue }) {
  let parsedMembers = [];

  if (parsedMembers) {
    parsedMembers = members.map((member) => {
      return {
        value: member.id,
        label: member.username
      };
    });
  }
  let parsedSelectedMembers = [];

  if (value) {
    parsedSelectedMembers = value.map((member) => {
      return member.id;
    });
  }

  const handleChange = (value) => {
    setValue((prevFields) => ({
      ...prevFields,
      assignees: value
    }));
  };

  return (
    <div>
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
