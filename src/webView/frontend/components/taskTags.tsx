import * as React from "react";
import { Select } from "antd";

export default function TaskTags({ tags, value, setValue }) {
  let parseTags = [];
  if (tags) {
    parseTags = tags.map((tag, key) => {
      return {
        id: key,
        value: tag.name,
        label: tag.name
      };
    });
  }

  let parsedSelectedTags = [];

  if (value) {
    parsedSelectedTags = value.map((tag) => {
      return tag.name;
    });
  }

  const handleChange = (value) => {
    setValue((prevFields) => ({
      ...prevFields,
      tags: value
    }));
  };

  return (
    <div>
      <Select
        mode="multiple"
        allowClear
        options={parseTags}
        style={{ width: "100%" }}
        defaultValue={parsedSelectedTags}
        onChange={handleChange}
      />
    </div>
  );
}
