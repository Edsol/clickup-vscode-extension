import * as React from "react";
import { Select, Typography } from "antd";
const { Text } = Typography;

export default function TaskTags({ tags, value, setValue }) {
  const parseTags =
    tags.map((tag, key) => {
      return {
        id: key,
        value: tag.name,
        label: tag.name
      };
    }) || {};

  const parsedSelectedTags =
    value.map((tag) => {
      return tag.name;
    }) || {};

  const handleChange = (value) => {
    console.log("tags value", value);
    setValue(() => ({
      tags: value
    }));
  };

  return (
    <div>
      <Text strong>Tags</Text>
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
