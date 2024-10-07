import * as React from "react";
import { Input, Typography } from "antd";
const { TextArea } = Input;
const { Text } = Typography;

export default function TaskDescription({ description }) {
  return (
    <div>
      <Text strong>Description</Text>
      <TextArea
        rows={4}
        placeholder="Add a comment"
        defaultValue={description}
      />
    </div>
  );
}
