import * as React from "react";
import { Input } from "antd";
const { TextArea } = Input;

export default function TaskDescription({ value, setValue }) {
  const handleChange = (value) => {
    setValue((prevFields) => ({
      ...prevFields,
      description: value.currentTarget.value
    }));
  };

  return (
    <div>
      <TextArea
        rows={10}
        placeholder="Add a comment"
        defaultValue={value}
        onChange={handleChange}
      />
    </div>
  );
}
