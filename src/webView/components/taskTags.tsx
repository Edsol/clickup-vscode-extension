import * as React from "react";
import { Select, Typography } from "antd";
const { Text } = Typography;

export default function TaskTags({ tags, value }) {
  const parseTags = tags.map((tag, key) => {
    return {
      id: key,
      value: tag.name,
      label: tag.name
    };
  });
  const parsedSelectedTags = value.map((tag) => {
    return tag.name;
  });

  return (
    <div>
      <Text strong>Tags</Text>
      <Select
        mode="multiple"
        allowClear
        options={parseTags}
        style={{ width: "100%" }}
        defaultValue={parsedSelectedTags}
      />
    </div>
  );
}
