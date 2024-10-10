import * as React from "react";
import { Input, Typography } from "antd";
const { TextArea } = Input;
const { Text } = Typography;

export default function TaskDescription({ value, setValue }) {
  const handleChange = (value) => {
    setValue(() => ({
      description: value.currentTarget.value
    }));
  };

  return (
    <div>
      <Text strong>Description</Text>
      <TextArea
        rows={4}
        placeholder="Add a comment"
        defaultValue={value}
        onChange={handleChange}
      />
    </div>
  );
}
