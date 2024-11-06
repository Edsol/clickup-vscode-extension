import * as React from "react";
import { Select, Space, Tag } from "antd";
import PriorityIcon from "@resources/official_icons/dark/priority.svg";
import { Priority } from "../../../types";

export default function TaskPriorities({ priorities, value, setValue }) {
  let parsedPriorities = [];

  if (priorities) {
    parsedPriorities = priorities.map((priority) => {
      return {
        value: priority.id,
        label: priority.priority,
        color: priority.color
      };
    });
  }

  const handleChange = (value) => {
    setValue((prevFields) => ({
      ...prevFields,
      priority: Number.parseInt(value)
    }));
  };

  function extractColor(label: string) {
    const res = priorities.filter((tag: Priority) => tag.priority === label)[0];
    if (!res) {
      return;
    }

    return res.color;
  }

  return (
    <Select
      options={parsedPriorities}
      defaultValue={value ? value.id : null}
      onChange={handleChange}
      allowClear
      style={{ minWidth: "100%" }}
      placeholder="select a priority"
      optionRender={(option) => (
        <Space>
          <PriorityIcon
            width="15"
            height="15"
            style={{ color: option.data.color }}
          />
          <span>{option.data.label}</span>
        </Space>
      )}
    />
  );
}
