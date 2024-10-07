import * as React from "react";
import { Select, Typography } from "antd";
const { Text } = Typography;

export default function TaskTags({ tags, value }) {
  console.log("value", value);
  const parseTags = tags.map((tag) => {
    return {
      value: tag.project_id,
      label: tag.name
    };
  });
  const parsedSelectedTags = value.map((tag) => {
    return [tag.project_id];
  });
  return (
    <div>
      <Text strong>Tags</Text>
      <Select
        mode="multiple"
        allowClear
        options={parseTags}
        style={{ width: "100%" }}
        value={parsedSelectedTags}
      />
    </div>
  );
}
