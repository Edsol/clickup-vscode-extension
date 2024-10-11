import * as React from "react";
import { Select, Space } from "antd";
import PriorityIcon from "@resources/official_icons/dark/priority.svg";

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
    console.log("priority handle", value);

    setValue((prevFields) => ({
      ...prevFields,
      priority: Number.parseInt(value)
    }));
  };

  return (
    <div>
      <Select
        options={parsedPriorities}
        style={{ width: "100%" }}
        defaultValue={value ? value.id : null}
        onChange={handleChange}
        allowClear
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
    </div>
  );
}
