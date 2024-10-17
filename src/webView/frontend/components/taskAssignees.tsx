import * as React from "react";
import { Select, Space, Tag } from "antd";
import { Member } from "../../../types";

export default function TaskAssignees({ members, value, setValue }) {
  let parsedMembers = [];

  if (members) {
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
        style={{ minWidth: "100%" }}
        mode="multiple"
        allowClear
        options={parsedMembers}
        defaultValue={parsedSelectedMembers}
        onChange={handleChange}
      />
    </div>
  );
}
